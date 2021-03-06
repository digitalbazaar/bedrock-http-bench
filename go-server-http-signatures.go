package main

import (
  // "crypto/rsa"
  "crypto/x509"
  "encoding/pem"
  "io/ioutil"
  // "fmt"
  "log"
  "net/http"
  "github.com/spacemonkeygo/httpsig"
  "golang.org/x/crypto/ed25519"
	"encoding/base64"
)

var (
  privKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEArpPmWDG3MCn3simEGNIeseNe3epn81gLnWXjup458yXgjUYF
qKcFlsV5oW4vSF5EEQfPqWB+E5NWYfE9IioQmmQjh28BhMXHq94HgQ90nKQ3KTpA
MOXNefvcun+qqOyr4Jf8y8esiYHjuitZA03o9OhzpqJwFzQj7Nxx2dg/3LnkcsP1
/RtY5zxnyEGEnxR+Sy+bPXEMbBk0+C3WrnmnLxNEwvWKj3iDp4JyLeV3WxWIf3Ex
gdkOWv3DwVo7pPmrSg+kQaU20QxQycY2xW7J8xqsqrvR3ICdYIevjFknMHX1LZB5
R6nfosG90pWVA2m5LqnAoEMBnG/CUpvxPRYyjwIDAQABAoIBAQCJZBpfBFlQDWdD
jorIYe0IQJGzgjvm9j7F058iik2+/us3I4lmjnPGkYlEs4uAn7df087pVOhEDatp
D0r2bTZ92xtfBcyjKmgW6XjsaDZ05IQI7TABi4lnXAD9wWWU5hXqfpLT6UPvQArx
xBWclR8mRx5lYOdoS3+OdHshX5/63ACCYlYonTov2TkIjvozQY4H5F0M0aaF3naM
GFRus8qmJTrfBmQPBBwRJnPJLQk03hAHXRyUHGHAo5QVZlEdvf5LeOTIfsw2X9ro
xGFBIruS2JfrWHbApTOIYlzCQBpBBM28l4/rvkfEDmugYaZE9LdpQfddQJOrnqXF
xHARbO0JAoGBANjqe0YKPsW/i6MEN0kOhcpYm19GYceXTSgErDsTDeEcvv6o9Chi
baRyNK1tZ+Kff4rMw74Vw+uIfpq5ROiTJ67p094jVmZhgmKsXAqIbapcR+R+bygO
Q3UioXCTCYvPKWL8n8FdgFsBohK4+y5NCgNZ8tIxqvB1fLQDs9AdhOxjAoGBAM4I
g/fUY5oBFS4KrMCQbz+DPzDTgMGrX0ZC7BD6S9jX/AI4Wwm11t/WWGuijUiQaFFd
YUHXVoe6qRuYemND2zUvbpBK84SVVxF3a6lncmpnxiLe2lHbj5/Dh+y/C7HKGiTC
jTfvfe8YAeTpC1djIH0sWPC6n91ulyA23Nz4h6rlAoGBAJVUT0s3cGF4bSvrkhfU
TJyxhT0A2f2qlm5PUTZV9r8bqAzuyS8oG60TBlrCL7te7FHkh3jLyRXT4LypgNvP
uoj65mVN1IQk6rr9R1vk8gJPBxsxQ1rC/wObtKIoR3EdS7OekGhw8xUzuZzEBf+o
/5SxDq5PjQt/BjtzNQ231LNbAoGAGDab+8Y0Jmc2LAEJKGBREq/D/2L74MbZHZLD
14Ly4vsPHNuup0d9hzTTk2K5I+wEtns48Nnzy2O+eAXFbGEPJAL9BWwpjk1WvDDC
sFf99E9Z08NI+RHKoUYDdWlGYJCV3fgXTJmSvUSfBF32/UAjE1Lg6PmlzAoxLJIG
BtoWZ5kCgYEAnvcfRx56ZvUkWJiSI0me+M20A74IGwxDPF87XuGPSEqcoLSc1qJM
6LtOFUE7nFVEqFMN2IhW59qb2eCg7XpeEQic4aqNkc8WtuMEavHRTucsEWk+ypZv
JCxLDG7o3iSqT+DNbYnDI7aUCuM6Guji98q3IvBnW5hj+jbmo4sfRDQ=
-----END RSA PRIVATE KEY-----`
)

// using base64 encoding for convenience, there is no standard base58 encoder
var ed25519_publicKey_base64 = "tr+DxzybcWZh/aS79+Mm95Zg/P7jAu4nSyVSTdbUCf0="
var ed25519_privateKey_base64 = "ny2yPFWxk1n1scEO96J7nmjzuoyCnpLcWU+6wHsfyGi2v4PHPJtxZmH9pLv34yb3lmD8/uMC7idLJVJN1tQJ/Q=="

func use(h http.HandlerFunc, middleware ...func(http.HandlerFunc) http.HandlerFunc) http.HandlerFunc {
  for _, m := range middleware {
    h = m(h)
  }

  return h
}

func handler(w http.ResponseWriter, r *http.Request) {
  if r.Method == "POST" {
    var results []string
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
      http.Error(w, "Error reading request body",
        http.StatusInternalServerError)
    }
    results = append(results, string(body))
  } else {
    http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
  }
}

func main() {
  // publicKey, privateKey, err := ed25519.GenerateKey(nil)
  // if err != nil {
  //   log.Println(err)
  // }
  // log.Println("pppppppp0", base64.StdEncoding.EncodeToString(publicKey))
  // log.Println("pppppppp1", base64.StdEncoding.EncodeToString(privateKey))

  tKey, err := base64.StdEncoding.DecodeString(ed25519_publicKey_base64)
  if err != nil {
    log.Println(err)
    // tb.Fatal(err)
  }
  var publicKeyEdDsa ed25519.PublicKey = tKey

  block, _ := pem.Decode([]byte(privKey))
  if block == nil {
    log.Println("test setup failure: malformed PEM on private key")
    // tb.Fatalf("test setup failure: malformed PEM on private key")
  }
  key, err := x509.ParsePKCS1PrivateKey(block.Bytes)
  if err != nil {
    log.Println(err)
    // tb.Fatal(err)
  }

  keystore := httpsig.NewMemoryKeyStore()
  keystore.SetKey("did:7e4a0145-c821-4e56-b41e-2e73e1b0615f/keys/1", key)
  // passing in pointer
  keystore.SetKey("did:ed31e31a-e32c-4cb6-a5d3-4c5deaffc2be/keys/1", &publicKeyEdDsa)

  var v = httpsig.NewVerifier(keystore)
  v.SetRequiredHeaders([]string{"(request-target)", "host", "date"})

  wrapped := httpsig.RequireSignature(http.HandlerFunc(handler), v, "")

  http.Handle("/post3", wrapped)
  // `handleFunc` allows use of regular function
  // http.HandleFunc("/post3", handler)
  // log.Fatal(http.ListenAndServe(":8080", nil))
  log.Fatal(http.ListenAndServeTLS(
    ":18443", "basic-server.crt", "basic-server.key", nil))
}
