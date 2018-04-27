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
)

var (
	privKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAqv8gApfU3FhZx1gyKmBUczZ1Ba3DQbqcGRJiwWz6wrr9E/K0
PcpRws/+GPc1znG4cKLdxkdyA2zROUt/lbaMTU+/kZzRh3ICZZOuo8kJpGqxPDIm
7L1lIcBLOWu/UEV2VaWNOENwiQbh61VJlR+kHK9LhQxYYZT554MYaXzcSRTC/RzH
DTAocf+B1go8tawPEixgs93+HHXoLPGypmqnlBKAjmGMwizbWFccDQqv0yZfAFpd
VY2MNKlDSUNMnZyUgBZNpGOGPm9zi9aMFT2dDrN9fpWMdu0QeZrJrDHzk6TKwtKr
BB9xNMuHGYdPxy8Ix0uNmUt0mqt6H5Vhl4O00QIDAQABAoIBAQCpA3yXM42AsY8j
mwgSnJ48NqJaF5L8P7+UhHi6KMZ+fSYydl0zCevge4bzFD3JrNuZ8VD1b57AxejT
Ec2so/9vVxjJi1AK6WR3FA608rumGJLQJd4Vd2ojfxabTeWOKOo642R/LSFpPzVE
T0toqxqiA53IhxhAc2jDLO+PLIvrao0Y8bWWq36tbxsAplrv8Gms6ZRwfKoX5P32
azBpJOqneNdSMRPHky6t2uiYyuPeG9pbuaClkD7Ss9lpH0V1DLQmAAlP9I0Aa06B
a9zPFPb3Ae8F0HO/tsf8gIvrlT38JvLe5VuCS7/LQNCZguyPZuZOXLDmdETfm1FD
q56rCV7VAoGBANmQ7EqDfxmUygTXlqaCQqNzY5pYKItM6RFHc9I+ADBWsLbuKtfP
XUMHQx6PvwCMBpjZkM7doGdzOHb0l3rW8zQONayqQxN9Pjd7K+dkSY6k0SScw46w
0AexDQSM/0ahVAHfXXi1GbKwlonM0nn/7JHz7n/fL9HwV8T3hAGClbPDAoGBAMk0
K5d+Ov55sKW0ZatZ0vTnfBCSrVEfG6FkcyK7uiSsMdWo2/De0VtJF7od2DM5UyP6
Y/DSVk4oPepbug5oGdu8t1Q3jbS61A7i/dssirQC4hEFAtoTGsVfaH8wu4AKyWd7
0rUmSrnyqNr4mfQBjdaXByvWO9rdEfZcZqaSQ4/bAoGAKy/CR7Q8eYZ4Z2eoBtta
gPl5rvyK58PXi8+EJRqbjPzYTSePp5EI8TIy15EvF9uzv4mIXhfOLFrJvYsluoOK
eS3M575QXEEDJZ40g9T7aO48eakIhH2CfdReQiX+0jVZ6Jk/A6PnOvokl6vpp7/u
ZLZoBEf4RRMRSQ7czDPwpWMCgYEAlNWZtWuz+hBMgpcqahF9AprF5ICL4qkvSDjF
Dpltfbk+9/z8DXbVyUANZCi1iFbMUJ3lFfyRySjtfBI0VHnfPvOfbZXWpi1ZtlVl
UZ7mT3ief9aEIIrnT79ezk9fM71G9NzcphHYTyrYi3pAcAZCRM3diSjlh+XmZqY9
bNRfU+cCgYEAoBYwp0PJ1QEp3lSmb+gJiTxfNwIrP+VLkWYzPREpSbghDYjE2DfC
M8pNbVWpnOfT7OlhN3jw8pxHWap6PxNyVT2W/1AHNGKTK/BfFVn3nVGhOgPgH1AO
sObYxm9gpkNkelXejA/trbLe4hg7RWNYzOztbfbZakdVjMNfXnyw+Q0=
-----END RSA PRIVATE KEY-----`
)

func use(h http.HandlerFunc, middleware ...func(http.HandlerFunc) http.HandlerFunc) http.HandlerFunc {
	for _, m := range middleware {
		h = m(h)
	}

	return h
}

func logger(h http.HandlerFunc) http.HandlerFunc {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    log.Println("Before")
    h.ServeHTTP(w, r) // call original
    log.Println("After")
  })
}

// type MyHandler struct{}
//
// func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
// 	if r.Method == "POST" {
//     var results []string
// 		body, err := ioutil.ReadAll(r.Body)
// 		if err != nil {
// 			http.Error(w, "Error reading request body",
// 				http.StatusInternalServerError)
// 		}
// 		results = append(results, string(body))
// 	} else {
// 		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
// 	}
// }

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
    var results []string
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body",
				http.StatusInternalServerError)
		}
		results = append(results, string(body))
    log.Println("HEHRE %s", results)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func main() {
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
  	keystore.SetKey("id:7e4a0145-c821-4e56-b41e-2e73e1b0615f/keys/1", key)
    var v = httpsig.NewVerifier(keystore)
    v.SetRequiredHeaders([]string{"(request-target)", "host", "date"})
    // wrapped := httpsig.RequireSignature(http.HandlerFunc(handler), v, "")
    // `handleFunc` allows use of regular function
    // http.HandleFunc("/post3", use(handler, httpsig))
    // http.Handle("/post3", wrapped)
    http.HandleFunc("/post3", handler)
    // http.HandleFunc("/post3", wrapped)
    // log.Fatal(http.ListenAndServe(":8080", nil))
    log.Fatal(http.ListenAndServeTLS(
      "bedrock.local:18443", "basic-server.crt", "basic-server.key", nil))
}
