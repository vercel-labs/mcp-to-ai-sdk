import { createServer } from "http";
import { exec } from "child_process";
import { promisify } from "util";
import { URL } from "url";
import crypto from "crypto";

const execAsync = promisify(exec);

interface OAuthConfig {
  authUrl: string;
  tokenUrl?: string;
  clientId?: string;
  clientSecret?: string;
  redirectPort?: number;
  scope?: string;
  resource?: string;
}

interface OAuthResult {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface AuthServerMetadata {
  authorization_endpoint: string;
  token_endpoint?: string;
  registration_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported?: string[];
  grant_types_supported?: string[];
  code_challenge_methods_supported?: string[];
}

interface ProtectedResourceMetadata {
  resource?: string;
  authorization_servers: string[];
  bearer_methods_supported?: string[];
  scopes_supported?: string[];
}

interface DynamicClientRegistrationRequest {
  redirect_uris: string[];
  client_name?: string;
  client_uri?: string;
  grant_types?: string[];
  response_types?: string[];
  scope?: string;
  token_endpoint_auth_method?: string;
}

interface DynamicClientRegistrationResponse {
  client_id: string;
  client_secret?: string;
  client_id_issued_at?: number;
  client_secret_expires_at?: number;
  redirect_uris: string[];
  grant_types?: string[];
}

/**
 * Handles OAuth authentication flow for MCP servers
 */
export class OAuthHandler {
  private redirectPort: number;
  private redirectUri: string;

  constructor(private config: OAuthConfig) {
    this.redirectPort = config.redirectPort || 3000;
    this.redirectUri = `http://localhost:${this.redirectPort}/callback`;
  }

  /**
   * Generate PKCE challenge and verifier
   */
  private generatePKCE(): { verifier: string; challenge: string } {
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto
      .createHash("sha256")
      .update(verifier)
      .digest("base64url");
    return { verifier, challenge };
  }

  /**
   * Generate a random state parameter for CSRF protection
   */
  private generateState(): string {
    return crypto.randomBytes(32).toString("base64url");
  }

  /**
   * Initiates OAuth flow and returns access token
   */
  async authenticate(): Promise<OAuthResult> {
    return new Promise((resolve, reject) => {
      // Create a temporary server to handle the OAuth callback
      const server = createServer((req, res) => {
        const url = new URL(req.url!, `http://localhost:${this.redirectPort}`);

        if (url.pathname === "/callback") {
          // Extract code or token from callback
          const code = url.searchParams.get("code");
          const accessToken = url.searchParams.get("access_token");
          const error = url.searchParams.get("error");

          if (error) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end(`
              <html>
                <body>
                  <h2>Authentication Failed</h2>
                  <p>Error: ${error}</p>
                  <p>You can close this window.</p>
                </body>
              </html>
            `);
            server.close();
            reject(new Error(`OAuth authentication failed: ${error}`));
            return;
          }

          if (accessToken) {
            // Implicit flow - token directly in URL
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <html>
                <body>
                  <h2>Authentication Successful!</h2>
                  <p>You can close this window and return to the terminal.</p>
                  <script>window.close();</script>
                </body>
              </html>
            `);
            server.close();
            resolve({ accessToken });
            return;
          }

          if (code) {
            // Verify state parameter
            const receivedState = url.searchParams.get("state");
            if (receivedState !== (server as any).state) {
              res.writeHead(400, { "Content-Type": "text/html" });
              res.end(`
                <html>
                  <body>
                    <h2>Authentication Failed</h2>
                    <p>Invalid state parameter - possible CSRF attack</p>
                    <p>You can close this window.</p>
                  </body>
                </html>
              `);
              server.close();
              reject(new Error("Invalid state parameter"));
              return;
            }

            // Authorization code flow - need to exchange code for token
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
              <html>
                <body>
                  <h2>Authentication Successful!</h2>
                  <p>Exchanging code for token...</p>
                  <p>You can close this window and return to the terminal.</p>
                  <script>window.close();</script>
                </body>
              </html>
            `);

            // Exchange code for token with PKCE verifier
            if (this.config.tokenUrl) {
              this.exchangeCodeForToken(code, (server as any).pkceVerifier)
                .then((result) => {
                  server.close();
                  resolve(result);
                })
                .catch((err) => {
                  server.close();
                  reject(err);
                });
            } else {
              // If no tokenUrl, assume the code is the token
              server.close();
              resolve({ accessToken: code });
            }
            return;
          }

          // No code or token received
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`
            <html>
              <body>
                <h2>Authentication Failed</h2>
                <p>No authorization code or token received.</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error("No authorization code or token received"));
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
      });

      server.listen(this.redirectPort, async () => {
        console.log(`\nOAuth authentication required for this MCP server.`);
        console.log(`Listening for callback on port ${this.redirectPort}...`);

        // Generate PKCE parameters
        const pkce = this.generatePKCE();
        const state = this.generateState();

        // Store PKCE verifier for later use
        (server as any).pkceVerifier = pkce.verifier;
        (server as any).state = state;

        // Build the authorization URL with PKCE
        const authUrl = new URL(this.config.authUrl);
        authUrl.searchParams.set("response_type", "code");
        authUrl.searchParams.set("redirect_uri", this.redirectUri);
        authUrl.searchParams.set("code_challenge", pkce.challenge);
        authUrl.searchParams.set("code_challenge_method", "S256");
        authUrl.searchParams.set("state", state);

        if (this.config.clientId) {
          authUrl.searchParams.set("client_id", this.config.clientId);
        }
        if (this.config.scope) {
          authUrl.searchParams.set("scope", this.config.scope);
        }
        // Include resource parameter as per RFC 8707
        if (this.config.resource) {
          authUrl.searchParams.set("resource", this.config.resource);
        }

        // Open the browser
        const urlString = authUrl.toString();
        console.log(`Opening browser for authentication...`);
        console.log(`If the browser doesn't open, please visit:`);
        console.log(`\n  ${urlString}\n`);

        try {
          await this.openBrowser(urlString);
        } catch (error) {
          console.warn(
            "Could not open browser automatically. Please open the URL manually."
          );
        }
      });

      // Set a timeout for the authentication process
      setTimeout(
        () => {
          server.close();
          reject(new Error("OAuth authentication timeout (5 minutes)"));
        },
        5 * 60 * 1000
      ); // 5 minutes
    });
  }

  /**
   * Exchange authorization code for access token with PKCE
   */
  private async exchangeCodeForToken(
    code: string,
    codeVerifier: string
  ): Promise<OAuthResult> {
    if (!this.config.tokenUrl) {
      throw new Error("Token URL not configured");
    }

    const params: Record<string, string> = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier,
    };

    if (this.config.clientId) {
      params.client_id = this.config.clientId;
    }

    if (this.config.clientSecret) {
      params.client_secret = this.config.clientSecret;
    }

    // Include resource parameter as per RFC 8707
    if (this.config.resource) {
      params.resource = this.config.resource;
    }

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Open browser with the given URL
   */
  private async openBrowser(url: string): Promise<void> {
    const platform = process.platform;
    let command: string;

    if (platform === "darwin") {
      command = `open "${url}"`;
    } else if (platform === "win32") {
      command = `start "${url}"`;
    } else {
      // Linux/Unix
      command = `xdg-open "${url}"`;
    }

    await execAsync(command);
  }

  /**
   * Check if a URL requires OAuth authentication
   */
  static async requiresOAuth(url: string): Promise<boolean> {
    try {
      // Try to connect without auth first
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "initialize",
          params: {
            clientInfo: {
              name: "mcp-tools-cli",
              version: "1.0.0",
            },
            capabilities: {},
          },
          id: 1,
        }),
      });

      // Check for OAuth indicators in headers or status
      if (response.status === 401) {
        const wwwAuth = response.headers.get("www-authenticate");
        if (wwwAuth) {
          // Parse WWW-Authenticate header for Bearer and resource_metadata
          const bearerMatch = /Bearer/i.test(wwwAuth);
          const metadataMatch = /resource_metadata="([^"]+)"/i.exec(wwwAuth);

          if (bearerMatch && metadataMatch) {
            // Store metadata URL for later use
            (OAuthHandler as any).lastMetadataUrl = metadataMatch[1];
            return true;
          } else if (bearerMatch) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      // Connection error might mean server is down, not OAuth required
      return false;
    }
  }

  /**
   * Discover Protected Resource Metadata
   */
  static async getProtectedResourceMetadata(
    url: string
  ): Promise<ProtectedResourceMetadata | null> {
    try {
      // First check if we have a metadata URL from WWW-Authenticate header
      let metadataUrl: URL;

      metadataUrl = new URL("/.well-known/oauth-protected-resource", url);

      const response = await fetch(metadataUrl.toString());

      if (response.ok) {
        const metadata = (await response.json()) as ProtectedResourceMetadata;
        return metadata;
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch protected resource metadata:", error);
      return null;
    }
  }

  /**
   * Discover Authorization Server Metadata
   */
  static async getAuthServerMetadata(
    authServerUrl: string
  ): Promise<AuthServerMetadata | null> {
    try {
      // Construct well-known endpoint for authorization server metadata
      const url = new URL(authServerUrl);

      // Try without path first (most common case)
      const metadataUrl = new URL(
        "/.well-known/oauth-authorization-server",
        url.origin
      );

      const response = await fetch(metadataUrl.toString());

      if (response.ok) {
        const metadata = (await response.json()) as AuthServerMetadata;
        return metadata;
      }

      // Try with path appended
      if (url.pathname && url.pathname !== "/") {
        const pathMetadataUrl = new URL(
          `/.well-known/oauth-authorization-server${url.pathname}`,
          url.origin
        );
        const pathResponse = await fetch(pathMetadataUrl.toString());

        if (pathResponse.ok) {
          const metadata = (await pathResponse.json()) as AuthServerMetadata;
          return metadata;
        }
      }

      // Fallback to older well-known endpoint
      const fallbackUrl = new URL(
        "/.well-known/openid-configuration",
        url.origin
      );
      const fallbackResponse = await fetch(fallbackUrl.toString());

      if (fallbackResponse.ok) {
        const metadata = (await fallbackResponse.json()) as AuthServerMetadata;
        return metadata;
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch authorization server metadata:", error);
      return null;
    }
  }

  /**
   * Register client dynamically with authorization server
   */
  static async registerClient(
    registrationEndpoint: string,
    redirectUri: string,
    clientName: string = "MCP Tools CLI"
  ): Promise<DynamicClientRegistrationResponse | null> {
    try {
      const request: DynamicClientRegistrationRequest = {
        redirect_uris: [redirectUri],
        client_name: clientName,
        grant_types: ["authorization_code"],
        response_types: ["code"],
        token_endpoint_auth_method: "none", // Public client
      };

      const response = await fetch(registrationEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const registration =
          (await response.json()) as DynamicClientRegistrationResponse;
        return registration;
      }

      return null;
    } catch (error) {
      console.error("Failed to register client:", error);
      return null;
    }
  }

  /**
   * Extract OAuth configuration from server response following MCP spec
   */
  static async getOAuthConfig(url: string): Promise<OAuthConfig | null> {
    // Strip path from URL to get base URL for transport
    let baseUrl = url;
    try {
      const parsed = new URL(url);
      baseUrl = `${parsed.protocol}//${parsed.host}`;
    } catch {
      // If not a valid URL, use as-is (for file paths)
      baseUrl = url;
    }

    try {
      // Step 1: Get Protected Resource Metadata
      const resourceMetadata = await this.getProtectedResourceMetadata(baseUrl);

      let authServerUrl: string;
      let authServerMetadata: AuthServerMetadata | null;

      if (
        !resourceMetadata ||
        !resourceMetadata.authorization_servers ||
        resourceMetadata.authorization_servers.length === 0
      ) {
        // Fallback for older servers: try to get auth server metadata directly from base URL
        console.log("Protected resource metadata not found, trying direct auth server metadata...");
        authServerUrl = baseUrl;
        authServerMetadata = await this.getAuthServerMetadata(authServerUrl);
        
        if (!authServerMetadata) {
          return null;
        }
      } else {
        // Step 2: Select first authorization server (could be enhanced to let user choose)
        authServerUrl = resourceMetadata.authorization_servers[0];

        // Step 3: Get Authorization Server Metadata
        authServerMetadata = await this.getAuthServerMetadata(authServerUrl);
      }

      if (!authServerMetadata) {
        return null;
      }

      // Step 4: Try dynamic client registration if supported
      let clientId: string | undefined;
      let clientSecret: string | undefined;

      if (authServerMetadata.registration_endpoint) {
        const redirectUri = `http://localhost:3000/callback`;
        const registration = await this.registerClient(
          authServerMetadata.registration_endpoint,
          redirectUri
        );

        if (registration) {
          clientId = registration.client_id;
          clientSecret = registration.client_secret;
        } else {
          console.log(
            "Dynamic client registration failed, will proceed without client_id"
          );
        }
      }

      return {
        authUrl: authServerMetadata.authorization_endpoint,
        tokenUrl: authServerMetadata.token_endpoint,
        clientId: clientId,
        clientSecret: clientSecret,
        resource: resourceMetadata?.resource || url, // Use the canonical resource URI
        scope: resourceMetadata?.scopes_supported?.join(" ") || authServerMetadata.scopes_supported?.join(" "),
      };
    } catch (error) {
      console.error("Failed to get OAuth configuration:", error);
      return null;
    }
  }
}
