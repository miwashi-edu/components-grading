# Components Grading

## Prepare

```bash
npm install
```


## Start server

```bash
npm run dev
```


## Storybook

```bash
npm run storybook
```



### Managing Auth Server in Background

You can manage the server as a background process using **PM2** (Process Manager 2). The following scripts are available in `package.json`:

- **Start in background**: `npm run server:start`
- **Stop background process**: `npm run server:stop`
- **Check status**: `npm run server:status`
- **View logs**: `npm run server:logs`

For a standard development start (foreground), you can still use `npm run server` or `npm start`.
