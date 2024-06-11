# JamAI Base Frontend Desktop App

## Get Started

### Development 

#### **Windows**

1.  Install [Rust](https://www.rust-lang.org/tools/install)
2.  Install [NodeJS](https://nodejs.org/en/download/prebuilt-binaries)
3.  Clone repository.
    ```
    git clone 
    ```
4.  Setup `.env` file
    ```
    DOCIO_URL=http://localhost:6979/api/docio
    UNSTRUCTUREDIO_URL=http://localhost:6989
    IS_WSL=1
    OWL_PORT=6969
    OWL_WORKERS=2
    OWL_DB_DIR=db
    OWL_LOG_DIR=logs
    DOCIO_WORKERS=2
    DOCIO_DEVICE=cpu
    EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
    RERANKER_MODEL=cross-encoder/ms-marco-TinyBERT-L-2
    OWL_CONCURRENT_ROWS_BATCH_SIZE=3
    OWL_CONCURRENT_COLS_BATCH_SIZE=5
    ORIGIN=http://localhost:4000
    JAMAI_URL=http://localhost:6969
    NODE_ENV=production
    BODY_SIZE_LIMIT=Infinity
    PUBLIC_IS_LOCAL='true'
    PUBLIC_JAMAI_URL=
    ```
5.  Set all the environment variables in the `.env`
    ```powershell
    .\Set-EnvVars.ps1
    ```
6.  Launch the app
    ```
    cd <repo>
    npm install
    npm run tauri dev
    ```
