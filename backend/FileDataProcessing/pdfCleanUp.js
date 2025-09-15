export function cleanPdfText(raw) {
  return raw
    // Normalize line breaks
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")          // collapse 3+ newlines into 2
    .replace(/[ \t]+/g, " ")             // collapse multiple spaces/tabs
    // Insert spaces where words/numbers are stuck
    .replace(/([a-z])([A-Z])/g, "$1 $2") // helloWorld -> hello World
    .replace(/([a-z])([0-9])/g, "$1 $2") // var1 -> var 1
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2") // 2cats -> 2 cats
    // Handle bullets
    .replace(//g, "•")                  // Word bullet
    .replace(/\u2022/g, "•")             // Standard bullet
    .replace(/•\s*/g, "\n• ")            // ensure bullet starts on new line
    // Add space around #
    .replace(/([A-Za-z])#(\d+)/g, "$1 #$2")
    // Fix common PDF squish: "machines(each" -> "machines (each"
    .replace(/([a-zA-Z])\(/g, "$1 (")
    .replace(/\)([a-zA-Z])/g, ") $1")
    // Clean double spaces again
    .replace(/\s{2,}/g, " ")
    .trim();
}


export default cleanPdfText;