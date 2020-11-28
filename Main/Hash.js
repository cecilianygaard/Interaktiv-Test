async function asyncHash (str) { 
  // Encryption code from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const encoder = new TextEncoder();
  const data = encoder.encode(str);                                                               //Encode string to Uint8Array
  const hashData = await crypto.subtle.digest("SHA-256", data);                                   //Call SHA-256 hash function
  const hashArray = Array.from(new Uint8Array(hashData));                                         //Get Uint8Array from Hash Data
  const hashString = hashArray.reduce((result, curr) => result + String.fromCharCode(curr), '');  //Convert Uint8Array to String
  const hash64 = btoa(hashString);                                                                //Convert String to Base64
  return hash64;
}
