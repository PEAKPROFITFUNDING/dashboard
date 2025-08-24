import React from 'react';
import { Challenge } from '../../services/payoutService';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Button from '../ui/button/Button';

interface ChallengeListProps {
  challenges: Challenge[];
  onRequestPayout: (challenge: Challenge) => void;
  loading?: boolean;
  error?: string | null;
}

const ChallengeList: React.FC<ChallengeListProps> = ({ challenges, onRequestPayout, loading, error }) => {
  if (loading) return <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading challenges...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!challenges.length) return <div className="py-8 text-center text-gray-500 dark:text-gray-400">No challenges found.</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Challenge</TableCell>
            <TableCell isHeader>Profit</TableCell>
            <TableCell isHeader>Drawdown</TableCell>
            <TableCell isHeader>Eligibility</TableCell>
            <TableCell isHeader>Next Payout</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {challenges.map((ch) => (
            <TableRow key={ch.id}>
              <TableCell>{ch.name}</TableCell>
              <TableCell>${ch.profit.toLocaleString()}</TableCell>
              <TableCell>${ch.drawdown.toLocaleString()}</TableCell>
              <TableCell>
                {ch.eligible ? (
                  <Badge color="success">Eligible</Badge>
                ) : (
                  <Badge color="error">Not Eligible</Badge>
                )}
              </TableCell>
              <TableCell>{formatCountdown(ch.nextPayoutDate)}</TableCell>
              <TableCell>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!ch.eligible || !ch.payoutWindowOpen}
                  onClick={() => onRequestPayout(ch)}
                >
                  Request Payout
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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

export default ChallengeList; 