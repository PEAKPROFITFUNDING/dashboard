import React, { useEffect, useState } from 'react';
import { fetchTraderAccounts, TraderAccount } from '../../services/payoutService';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table';
import Badge from '../ui/badge/Badge';

interface Props {
  onSelect: (account: TraderAccount) => void;
  selectedAccountId?: string;
}

const EligibleAccountsList: React.FC<Props> = ({ onSelect, selectedAccountId }) => {
  const [accounts, setAccounts] = useState<TraderAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTraderAccounts()
      .then(setAccounts)
      .catch(() => setError('Failed to load accounts'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (accounts.length === 0) return <div>No accounts found.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Account</TableCell>
          <TableCell isHeader>Challenge</TableCell>
          <TableCell isHeader>Eligibility</TableCell>
          <TableCell isHeader>Next Payout</TableCell>
          <TableCell isHeader>Performance</TableCell>
          {/* <TableCell isHeader></TableCell> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((acc) => (
          <TableRow key={acc.id} className={selectedAccountId === acc.id ? 'bg-blue-50' : ''}>
            <TableCell>{acc.name}</TableCell>
            <TableCell>{acc.challengeType}</TableCell>
            <TableCell>
              {acc.eligible ? (
                <Badge color="success">Eligible</Badge>
              ) : (
                <Badge color="error">Not Eligible</Badge>
              )}
            </TableCell>
            <TableCell>{formatCountdown(acc.nextPayoutDate)}</TableCell>
            <TableCell>{acc.performanceSummary}</TableCell>
            <TableCell>
              <button
                className="btn btn-primary"
                disabled={!acc.eligible}
                onClick={() => onSelect(acc)}
              >
                Select
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function formatCountdown(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'Now';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h`;
}

export default EligibleAccountsList; 