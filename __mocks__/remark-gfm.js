// Manual mock for remark-gfm to bypass ESM transform issues in Jest
export default function remarkGfm() {
  return null;
}