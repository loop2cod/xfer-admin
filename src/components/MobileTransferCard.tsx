"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, Eye, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { TransferRequest } from "@/lib/api"

interface MobileTransferCardProps {
  transfer: TransferRequest
  onApprove?: (transfer: TransferRequest) => void
  onReject?: (transfer: TransferRequest) => void
  showActions?: boolean
}

export default function MobileTransferCard({
  transfer,
  onApprove,
  onReject,
  showActions = false,
}: MobileTransferCardProps) {
  const router = useRouter()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
      case "awaiting_crypto":
      case "crypto_received":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
      case "cancelled":
      case "expired":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
      case "awaiting_crypto":
      case "crypto_received":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "cancelled":
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number | string, currency: string = "USD") => {
    return `$${Number(amount).toFixed(2)} ${currency}`
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(transfer.status)}
              <span className="font-medium text-sm">{transfer.transfer_id}</span>
            </div>
            <Badge className={`text-xs ${getStatusColor(transfer.status)}`}>
              {transfer.status}
            </Badge>
          </div>

          {/* Customer Info */}
          <div>
            <p className="font-medium text-sm">
              {transfer.user ? `${transfer.user.first_name} ${transfer.user.last_name}` : 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500">{transfer.user?.email || 'No email'}</p>
          </div>

          {/* Transfer Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 text-xs">Type</p>
              <Badge variant="outline" className="text-xs">
                {(transfer.transfer_type || (transfer as any).type || 'crypto-to-fiat').replace(/[-_]/g, ' to ')}
              </Badge>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Date</p>
              <p className="text-xs">{formatDate(transfer.created_at)}</p>
            </div>
          </div>

          {/* Amount Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Amount</p>
                <p className="font-medium">{formatCurrency(transfer.amount, transfer.currency)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Net Amount</p>
                <p className="font-medium">
                  {formatCurrency(transfer.net_amount || (transfer as any).amount_after_fee || 0, transfer.currency)}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-gray-600 text-xs">Fee</p>
              <p className="text-xs">
                {formatCurrency(transfer.fee_amount || (transfer as any).fee || 0, transfer.currency)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              onClick={() => router.push(`/requests/details/${transfer.id}`)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            
            {showActions && onApprove && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex-1"
                onClick={() => onApprove(transfer)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
            
            {showActions && onReject && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 flex-1"
                onClick={() => onReject(transfer)}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}