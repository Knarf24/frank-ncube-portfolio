# ShopAccess AI: contribution section (DRAFT, not published)

The case study intentionally has no "My contribution" section. The ShopAccess AI
repository does not establish who built what, so nothing about individual
authorship or team size is shown on the site.

Evidence found (not proof of contribution):
- Commits are authored under two names ("Knarf24", "FRANK NCUBE") with one email.
- The repository's documents describe work done with AI coding assistants under
  written directives and an "owner" role, and name Codex and Claude as
  implementer and reviewer in places.

Facts needed before this section is written:
1. Were there other human teammates? Names and roles, or "solo".
2. What did Frank personally do (product direction, requirements, specs,
   testing, review, writing code, demo video)?
3. Should the page say the project was built with AI coding assistants
   directed by Frank? Preferred wording?
4. Is a Devpost submission link available to add?

To publish: add a `contribution` object to `data/shopaccess-ai.ts` (the existing
`ContributionSection` component renders it) and remove the "authorship" test
assertion that expects it to be undefined in `__tests__/project-data.test.ts`.
