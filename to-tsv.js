const path = require("path");
const fs = require("fs").promises;
const _ = require("lodash");

async function main() {
    const inputPath = path.resolve(path.join(process.cwd(), "wcag.json"));
    const outputPath = path.resolve(path.join(process.cwd(), "wcag.tsv"));

    console.log(`Reading JSON file at ${inputPath}`);
    const contents = await fs.readFile(inputPath, "utf8");
    const asJson = JSON.parse(contents);

    const output = wcagToCsv(asJson);

    console.log(`Writing TSV file at ${outputPath}`);
    await fs.writeFile(outputPath, output);

    console.log(`Success!`);
}

function wcagToCsv(wcag) {
    return [`SC Title\tURL\tDescription`]
        .concat(
            _.flatMap(wcag, (principle) =>
                _.flatMap(principle.guidelines, (guideline) =>
                    _.flatMap(
                        guideline.success_criteria,
                        ({ ref_id, title, url, description }) =>
                            `${ref_id}: ${title}\t${url}\t${description}`
                    )
                )
            )
        )
        .join("\n");
}

main();
