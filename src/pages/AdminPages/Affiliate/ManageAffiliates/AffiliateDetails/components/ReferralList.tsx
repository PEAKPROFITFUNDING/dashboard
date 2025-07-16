import Badge from "../../../../../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../../../components/ui/table";
import { Referral } from "./types";

interface ReferralListProps {
  referrals: Referral[];
}

export default function ReferralList({ referrals }: ReferralListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Referral List
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Signed Up
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Deposited
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Passed Challenge
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {referrals.map((referral) => (
                <TableRow
                  key={referral.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {referral.fullName}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {referral.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {referral.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={referral.signedUp ? "success" : "error"}
                    >
                      {referral.signedUp ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={referral.deposited ? "success" : "error"}
                    >
                      {referral.deposited ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={referral.passedChallenge ? "success" : "error"}
                    >
                      {referral.passedChallenge ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
