# Troubleshooting Guide for Arda Tolkien Timeline Explorer

This document summarizes the issues encountered during the development and deployment of the **Arda Tolkien Timeline Explorer** and their solutions. It also provides additional troubleshooting tips to help diagnose and resolve similar problems.

---

## Table of Contents
- [Issue 1: Backend Fails to Start](#issue-1-backend-fails-to-start)
- [Issue 2: API Route Returns 404](#issue-2-api-route-returns-404)
- [Issue 3: Frontend Not Fetching API Data](#issue-3-frontend-not-fetching-api-data)
- [Issue 4: Static Assets Not Loading](#issue-4-static-assets-not-loading)
- [Issue 5: Conflicts Between VirtualHosts](#issue-5-conflicts-between-virtualhosts)
- [General Troubleshooting Tips](#general-troubleshooting-tips)

---

## Issue 1: Backend Fails to Start

### Symptom
The backend service fails to start with an error, such as:
```
Error: The module '/path/to/better_sqlite3.node' was compiled against a different Node.js version.
```

### Cause
- `better-sqlite3` was compiled using a different version of Node.js than the one currently installed.

### Solution
1. Rebuild the `better-sqlite3` module:
   ```bash
   npm rebuild better-sqlite3
   ```
2. If rebuilding fails, reinstall the module:
   ```bash
   npm uninstall better-sqlite3
   npm install better-sqlite3
   ```

---

## Issue 2: API Route Returns 404

### Symptom
Requests to `/api/events` return a 404 error:
```
Cannot GET /api/events
```

### Cause
- The backend route is not defined correctly in `index.ts`.
- The backend is not running or listening on the correct port.

### Solution
1. Ensure the route is defined in the backend:
   ```ts
   app.get('/api/events', (req, res) => {
       const events = db.prepare('SELECT * FROM events').all();
       res.json(events);
   });
   ```
2. Verify the backend is running and listening on port 3000:
   ```bash
   curl http://127.0.0.1:3000/api/events
   ```
3. Check backend logs for errors:
   ```bash
   sudo journalctl -u arda.service -n 50
   ```

---

## Issue 3: Frontend Not Fetching API Data

### Symptom
The app displays no data, and the browser console logs:
```
Failed to fetch events: SyntaxError: Unexpected token '<', "<!DOCTYPE..." is not valid JSON.
```

### Cause
- The frontend is incorrectly fetching from `/api/events` instead of `/arda/api/events` in production.

### Solution
1. Set the correct API base URL in `.env.production`:
   ```env
   VITE_API_BASE_URL=/arda/api
   ```
2. Update the fetch call in `App.tsx`:
   ```ts
   const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
   fetch(`${apiBase}/events`)
   ```
3. Rebuild and redeploy the frontend:
   ```bash
   npm run build
   sudo cp -R dist/* /var/www/hobunror/arda/project/dist/
   sudo systemctl restart apache2
   ```

---

## Issue 4: Static Assets Not Loading

### Symptom
Static assets like `vite.svg` fail to load, returning a 404 error.

### Cause
- The `base` configuration in `vite.config.ts` is not set for the deployment subpath.

### Solution
1. Set the base path in `vite.config.ts`:
   ```ts
   export default defineConfig({
       base: '/arda/',
       plugins: [react()],
   });
   ```
2. Rebuild and redeploy the frontend:
   ```bash
   npm run build
   sudo cp -R dist/* /var/www/hobunror/arda/project/dist/
   sudo systemctl restart apache2
   ```

---

## Issue 5: Conflicts Between VirtualHosts

### Symptom
One site (e.g., `/allsky`) returns a 404 after another site (e.g., `/arda`) is added.

### Cause
- Overlapping `VirtualHost` configurations for `hobunror.nl` on port 443.

### Solution
1. Ensure each VirtualHost explicitly handles its subpath. For example, in `/etc/apache2/sites-available/allsky.conf`:
   ```apache
   Alias /allsky /var/www/hobunror/allsky
   <Directory /var/www/hobunror/allsky>
       Options -Indexes +FollowSymLinks
       AllowOverride None
       Require all granted
       DirectoryIndex index.html
       RewriteEngine On
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteRule ^ /index.html [L]
   </Directory>
   ```
2. Check active VirtualHosts:
   ```bash
   sudo apachectl -S
   ```
3. Reload Apache:
   ```bash
   sudo systemctl reload apache2
   ```

---

## General Troubleshooting Tips

1. **Check Logs**
   - Backend: `sudo journalctl -u arda.service -n 50`
   - Apache: `sudo tail -f /var/log/apache2/arda_error.log`

2. **Test API Endpoints**
   ```bash
   curl http://127.0.0.1:3000/api/events
   curl https://hobunror.nl/arda/api/events
   ```

3. **Verify File Permissions**
   Ensure the backend has access to the database file:
   ```bash
   sudo chown -R www-data:www-data /var/www/hobunror/arda/project
   ```

4. **Check Service Status**
   ```bash
   sudo systemctl status arda.service
   ```

5. **Test Proxy Configuration**
   Ensure Apache is correctly proxying API requests:
   ```bash
   curl -I https://hobunror.nl/arda/api/events
   ```

---

This troubleshooting guide provides solutions to common issues encountered during development and deployment. By following these steps, you can quickly diagnose and resolve most problems with the Arda Tolkien Timeline Explorer.

