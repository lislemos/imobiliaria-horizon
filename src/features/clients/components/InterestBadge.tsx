import { interestLabel } from '../model/interests'
import type { Interest } from '../model/types'

type InterestBadgeProps = { interest: Interest }

export function InterestBadge({ interest }: InterestBadgeProps) {
  return (
    <span className={`badge badge--${interest}`}>
      <span className="badge__dot" />
      {interestLabel[interest]}
    </span>
  )
}
