# Private tooling submodules

The public [carlxaeron/carlxaeron.github.io](https://github.com/carlxaeron/carlxaeron.github.io) repo keeps the portfolio / GitHub Pages surface. Tooling that should not be public is checked out as **private** git submodules at the same paths as before.

## Map

| Local path | Private repo |
|------------|--------------|
| `api-carlxaeron/` | [carlxaeron/api-carlxaeron](https://github.com/carlxaeron/api-carlxaeron) |
| `client-sites/` | [carlxaeron/client-sites](https://github.com/carlxaeron/client-sites) |
| `OnlineJobs-MCP-Server/` | [carlxaeron/onlinejobs-mcp-server](https://github.com/carlxaeron/onlinejobs-mcp-server) |
| `Hosting-SSH-MCP-Server/` | [carlxaeron/hosting-ssh-mcp-server](https://github.com/carlxaeron/hosting-ssh-mcp-server) |
| `Namecheap-MCP-Server/` | [carlxaeron/namecheap-mcp-server](https://github.com/carlxaeron/namecheap-mcp-server) |
| `Office-Word-MCP-Server/` | [carlxaeron/office-word-mcp-server](https://github.com/carlxaeron/office-word-mcp-server) |

Still **not** submodules (local / gitignored): `job-applications/`, `agency-agents/`, `exports/`, `.env` files.

## Clone

```bash
git clone --recurse-submodules git@github.com:carlxaeron/carlxaeron.github.io.git
cd carlxaeron.github.io
```

Or:

```bash
git clone git@github.com:carlxaeron/carlxaeron.github.io.git
cd carlxaeron.github.io
git submodule update --init --recursive
```

SSH (or HTTPS with a token that can read private repos) is required for the submodule remotes.

## Day-to-day

1. Work inside the submodule directory as a normal git repo (`cd api-carlxaeron && git checkout -b …`).
2. Push to that private remote.
3. In the **parent** repo, commit the updated gitlink (the submodule SHA) when you want the parent to pin a new tip.

## GitHub Pages / CI

[`.github/workflows/static.yml`](.github/workflows/static.yml) checks out the public tree **without** recursive submodules. Portfolio build only needs `src/`, `public/`, and related public files.

## History note

Removing folders from the public tip stops **future** exposure. Older commits on the public repo may still contain those trees until a history rewrite (not done by default).
