// A utility function to safely escape JSON for embedding in a <script> tag
export default function safeStringify(data) {
  return JSON.stringify(data).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
}
