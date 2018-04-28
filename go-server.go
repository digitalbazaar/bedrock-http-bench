package main

import (
  "io/ioutil"
  // "fmt"
  "log"
  "net/http"
  // "github.com/spacemonkeygo/httpsig"
)

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
    http.HandleFunc("/post3", handler)
    // log.Fatal(http.ListenAndServe(":8080", nil))
    log.Fatal(http.ListenAndServeTLS(
      ":18443", "basic-server.crt", "basic-server.key", nil))
}
