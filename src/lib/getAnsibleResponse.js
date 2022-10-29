import { getMatchBetweenPattern, getMatchBetweenRegex } from "./Utils";

export const getAnsibleResponse = (output, play) => {
  const task_started = output?.some((l) =>
    l.includes(`PLAY [${play.toUpperCase()}]`)
  );

  const task_finished =
    task_started &&
    output?.some(
      (l) => l.includes("PLAY RECAP") || l.includes("UNREACHABLE! =>")
    );

  const task_success = output?.some(
    (l) => l.includes("unreachable=0") && l.includes("failed=0")
  );

  let promise = new Promise((resolve, reject) => {
    if (task_finished) {
      if (task_success) {
        console.dir("successful promise");
        resolve(
          JSON.parse(
            getMatchBetweenPattern(
              output.join(""),
              play.toUpperCase()
            ).replaceAll("'", '"')
          )
        );
      } else {
        console.dir("failed promise");
        reject(getMatchBetweenRegex(output.join(""), '"msg": "', '"[,}]'));
      }
    }
  });

  return promise;
};
