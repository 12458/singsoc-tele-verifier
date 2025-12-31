/**
 * CAS Authentication Utilities
 * Server-side only - do not import in client components
 */

export interface CASValidationResult {
  success: boolean;
  user?: string;
  error?: string;
}

/**
 * Parse CAS XML validation response
 * Returns the username if valid, null if invalid
 */
function parseCASResponse(xmlText: string): CASValidationResult {
  // Check for authentication success
  const successMatch = xmlText.match(/<cas:user>([^<]+)<\/cas:user>/);
  if (successMatch) {
    return { success: true, user: successMatch[1] };
  }

  // Check for authentication failure
  const failureMatch = xmlText.match(
    /<cas:authenticationFailure[^>]*>([^<]*)<\/cas:authenticationFailure>/
  );
  if (failureMatch) {
    return { success: false, error: failureMatch[1].trim() || "Authentication failed" };
  }

  return { success: false, error: "Invalid CAS response" };
}

/**
 * Validate a CAS ticket with the CAS server
 */
export async function validateCASTicket(
  casServerUrl: string,
  ticket: string,
  serviceUrl: string
): Promise<CASValidationResult> {
  const validateUrl = new URL(`${casServerUrl}/p3/serviceValidate`);
  validateUrl.searchParams.set("ticket", ticket);
  validateUrl.searchParams.set("service", serviceUrl);

  try {
    const response = await fetch(validateUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/xml",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: `CAS server returned ${response.status}` };
    }

    const xmlText = await response.text();
    return parseCASResponse(xmlText);
  } catch (error) {
    return { success: false, error: `Failed to contact CAS server: ${error}` };
  }
}

/**
 * Build the CAS login URL
 */
export function buildCASLoginUrl(casServerUrl: string, serviceUrl: string): string {
  return `${casServerUrl}/login?service=${encodeURIComponent(serviceUrl)}`;
}

/**
 * Get the service URL for CAS callback
 */
export function getServiceUrl(baseUrl: string): string {
  return `${baseUrl}/auth/callback`;
}
