/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional: override Hugging Face Inference chat model id (Inference Providers). */
  readonly VITE_HF_CHAT_MODEL?: string
}
