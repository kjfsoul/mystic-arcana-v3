{
  "onFileChange": {
    "watch": ["client/src/components/tarot/**"],
    "run": [
      "command:diff:alert-if-removed-lines>10",
      "notify:⚠️ Possible regression in Tarot UI — check deletions carefully."
    ]
  }
}
