#!/usr/bin/env python3
"""Static file server that serves .html for extensionless paths (e.g. /about -> about.html)."""
import http.server
import os
import urllib.parse

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url = urllib.parse.unquote(self.path)
        path = url.split('?')[0].lstrip('/')
        if not path or path == 'index':
            path = 'index.html'
        elif not os.path.splitext(path)[1]:
            path = path + '.html'
        if os.path.isfile(path):
            self.path = '/' + path
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    port = 8000
    with http.server.HTTPServer(('', port), CleanURLHandler) as httpd:
        print('Serving at http://localhost:{}/ (extensionless URLs -> .html)'.format(port))
        httpd.serve_forever()
