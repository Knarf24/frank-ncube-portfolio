import { Fragment, type ReactNode } from "react";

// Terms that must never break across lines (e.g. at the hyphen in "TF-IDF").
const NO_BREAK_TERMS = ["TF-IDF"];

const pattern = new RegExp(`(${NO_BREAK_TERMS.join("|")})`, "g");

export function noBreakTerms(text: string): ReactNode {
  return text.split(pattern).map((part, index) =>
    NO_BREAK_TERMS.includes(part) ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
