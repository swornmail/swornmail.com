// CloudFront viewer-request function: map directory-style URIs onto the
// objects a Next.js static export actually writes.
//
// Next emits out/index.html and out/<route>/index.html. S3 has no directory
// index, so a request for "/docs/" would look for an object literally named
// "docs/" and 404. This appends index.html, and adds a trailing slash first
// where the path has no file extension.
//
// Only "/" matters for a single-page site, and CloudFront's default root
// object already covers that. This exists so the documentation site does not
// have to rediscover the problem.
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
        return request;
    }

    // No extension in the last segment means it is a route, not a file.
    var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
    if (lastSegment.indexOf('.') === -1) {
        request.uri = uri + '/index.html';
    }

    return request;
}
