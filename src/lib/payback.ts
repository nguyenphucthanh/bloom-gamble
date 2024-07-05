type PlayerKey = string;
type CollectorKey = PlayerKey;
type DebtorCredit = {
  player: PlayerKey;
  amount: number;
};

export type InputPoint = Record<PlayerKey, number>;

export type Payback = Map<CollectorKey, DebtorCredit[]>;

export function payback(state: InputPoint): Payback {
  const paybackAmounts = new Map<CollectorKey, DebtorCredit[]>();

  const creditors: DebtorCredit[] = [];

  const debtors: DebtorCredit[] = [];

  Object.keys(state).forEach((key) => {
    const point = state[key];
    if (point > 0) {
      creditors.push({
        player: key,
        amount: point,
      });
    } else {
      debtors.push({
        player: key,
        amount: Math.abs(point),
      });
    }
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => a.amount - b.amount);

  while (creditors.length && debtors.length) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const amount = Math.min(debtor.amount, creditor.amount);
    const paybackAmount: DebtorCredit = { player: debtor.player, amount };

    if (!paybackAmounts.has(creditor.player)) {
      paybackAmounts.set(creditor.player, []);
    }

    const entry = paybackAmounts.get(creditor.player);
    if (entry) {
      entry?.push(paybackAmount);
      paybackAmounts.set(creditor.player, entry);
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) {
      debtors.shift();
    }
    if (creditor.amount === 0) {
      creditors.shift();
    }
  }

  return paybackAmounts;
}
