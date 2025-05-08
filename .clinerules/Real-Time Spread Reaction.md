{
  "onFileChange": {
    "watch": [
      "client/src/utils/tarot-utils.ts",
      "netlify/functions/daily-tarot.js"
    ],
    "run": [
      "notify:♻️ Tarot logic updated. Rerunning validation.",
      "command:run:validate-daily-card"
    ]
  }
}
