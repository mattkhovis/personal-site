// Selected work. Client, employer, vendor, and colleague names are left out on purpose.
// Each item is taken from the pull request description or the work portfolio. Do not add claims they do not support.
module.exports = [
  {
    tag: "Integration fix",
    title: "Retry loop in a phone maker's warranty integration",
    when: "Sep 2026",
    problem:
      "The manufacturer rejected repair status updates, and our system resent them without limit. In 7 days, 2,241 of 2,873 calls failed (78%). One ticket sent 161 calls in 4.8 days.",
    did:
      "Found the cause: a rejected update forced a rollback, the rollback left the inbound queue message open, and the queue delivered it again. Replaced a five-part fix with one check: retry only on known temporary faults.",
    result: "A rejected update is now recorded once and the ticket saves.",
    stack: ["PHP", "Message queues", "Root-cause analysis"],
  },
  {
    tag: "Integration",
    title: "Parts-invoice ledger for warranty repairs",
    when: "Nov 2026",
    problem:
      "A retailer gets paid for a warranty part only when the part line sent to the manufacturer has the correct invoice number. Our system did not send one.",
    did:
      "Added a ledger integration. The system gets one invoice number for each part unit, sends it on the part line, and releases that exact invoice when a part is removed or a ticket is cancelled. Off by default, on per location.",
    result: "The retailer can bill the manufacturer for each part.",
    stack: ["PHP", "MySQL", "REST API"],
  },
  {
    tag: "Integration fix",
    title: "Ready-for-pickup updates that failed 35% of the time",
    when: "Oct 2026",
    problem:
      "Stores got an error when they moved a device-maker repair to Ready for Pickup. In 60 days, 1,254 of 3,572 updates failed and the ticket save stopped.",
    did:
      "Showed with a production query that the cause was not the serial numbers, as the error said. The update was sent after the repair was already complete. Now, when that happens, the system checks the repair status and continues.",
    result: "Stores can finish the ticket. The error email for this case stopped.",
    stack: ["PHP", "SQL", "API debugging"],
  },
  {
    tag: "New platform",
    title: "Customers MVP on the rebuilt platform",
    when: "Aug – Nov 2026",
    problem: "The company is rebuilding its product from scratch. The first release needed a defined scope.",
    did:
      "Wrote the 21 MVP epics for the backlog. Built much of the Customers epic: an append-only customer ledger with reversals, credit limits, and reconciliation, plus audit trail, notes, duplicate merge, and location scoping.",
    result: "Customers MVP (48 tickets) certified for release 2.0 on 10 November 2026.",
    stack: ["Laravel", "Vue", "TypeScript"],
  },
  {
    tag: "Tax and payments",
    title: "Tax engine and a payment-provider contract for the new POS",
    when: "Jul – Nov 2026",
    problem:
      "The new POS had no tax engine and no card payment contract. Nothing defined what a timeout, an unknown result, or a duplicate request should do.",
    did:
      "Built tax with dated rates, inclusive and exclusive pricing, exemption certificates, an audit trail, and filing reports. Then wrote one provider contract and payment state machine, with idempotency keys so a duplicate request makes no second charge.",
    result: "A new payment provider plugs in without POS changes.",
    stack: ["Laravel", "PHP", "Domain design"],
  },
  {
    tag: "Enterprise RFP",
    title: "Four RFP demo modules, after an audit showed none could ship",
    when: "Jun – Jul 2026",
    problem:
      "The tracker showed four demo features for an enterprise RFP as nearly done. I checked the code against the tickets. None of the four could ship.",
    did:
      "Re-planned all four, then built them: workforce management (8 screens and a reporting engine), a document vault, a customer-feedback module, and a kiosk. Ported each to the new platform.",
    result: "The demo went ahead on 21 July 2026.",
    stack: ["PHP", "Laravel", "Vue"],
  },
  {
    tag: "Security",
    title: "Customer records open across locations",
    when: "Oct 2026",
    problem:
      "On the new platform, with restricted sharing on, a user could open, edit, or delete a customer at any location by ID. Search and lists also returned every location.",
    did:
      "Moved the access rule into one place, matched the old system's behavior, and added middleware that returns 404 for out-of-scope and missing customers alike, so the response does not confirm a record exists.",
    result: "Users see only customers at their locations. Also fixed an SQL injection risk in an inventory import.",
    stack: ["Laravel", "Authorization"],
  },
  {
    tag: "Agent tooling",
    title: "Ticket-to-pull-request pipeline",
    when: "2026",
    problem: "I was opening hundreds of small changes. I needed each one planned and tested the same way.",
    did:
      "Built a pipeline in which one AI worker takes a ticket from plan to a ready pull request and stops for my review and merge. Required an acceptance test on every pull request an agent opens. Built 21 client and testing agents.",
    result: "Used for the Customers MVP tickets.",
    stack: ["Claude Code", "Agents", "CI"],
  },
];
