/**
 * Extract the real client IP from request headers.
 *
 * Behind Cloudflare, `CF-Connecting-IP` is set to the actual client as a single
 * value and is the header to trust. Falls back to the leftmost entry of
 * `X-Forwarded-For` (the original client) when CF is not in front of us.
 *
 * Never use the full `X-Forwarded-For` chain as a rate-limit key: it includes
 * every proxy hop, so two unrelated users sharing a Cloudflare edge collide
 * on the same bucket and produce false 429s.
 */
export function getClientIP(request: Request): string | null {
    const cfIp = request.headers.get('CF-Connecting-IP');
    if (cfIp && cfIp.trim() !== '') {
        return cfIp.trim();
    }
    const xff = request.headers.get('X-Forwarded-For');
    if (xff) {
        const first = xff.split(',')[0]?.trim();
        if (first) return first;
    }
    return null;
}
