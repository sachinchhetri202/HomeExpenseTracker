import { splitEvenly, splitCustom, calculateBalance, CustomSplit } from '../lib/utils'

describe('Expense Splitting Utilities', () => {
  describe('splitEvenly', () => {
    it('should split evenly when amount divides perfectly', () => {
      const result = splitEvenly(30.00, ['user1', 'user2', 'user3'])
      expect(result).toEqual([
        { userId: 'user1', amount: 10.00 },
        { userId: 'user2', amount: 10.00 },
        { userId: 'user3', amount: 10.00 }
      ])
    })

    it('should handle odd cents by adjusting the last user', () => {
      const result = splitEvenly(10.01, ['user1', 'user2', 'user3'])
      expect(result).toEqual([
        { userId: 'user1', amount: 3.33 },
        { userId: 'user2', amount: 3.33 },
        { userId: 'user3', amount: 3.35 }
      ])
      
      // Verify total is preserved
      const total = result.reduce((sum, split) => sum + split.amount, 0)
      expect(total).toBeCloseTo(10.01, 2)
    })

    it('should handle single user split', () => {
      const result = splitEvenly(25.99, ['user1'])
      expect(result).toEqual([
        { userId: 'user1', amount: 25.99 }
      ])
    })

    it('should handle two-cent remainder', () => {
      const result = splitEvenly(10.02, ['user1', 'user2', 'user3'])
      expect(result).toEqual([
        { userId: 'user1', amount: 3.34 },
        { userId: 'user2', amount: 3.34 },
        { userId: 'user3', amount: 3.34 }
      ])
      
      // Verify total is preserved
      const total = result.reduce((sum, split) => sum + split.amount, 0)
      expect(total).toBeCloseTo(10.02, 2)
    })

    it('should throw error for empty user array', () => {
      expect(() => splitEvenly(10.00, [])).toThrow('Cannot split expense among zero users')
    })
  })

  describe('splitCustom', () => {
    it('should accept valid custom splits', () => {
      const customSplits: CustomSplit[] = [
        { userId: 'user1', amount: 15.50 },
        { userId: 'user2', amount: 10.25 },
        { userId: 'user3', amount: 4.25 }
      ]
      
      const result = splitCustom(30.00, customSplits)
      expect(result).toEqual([
        { userId: 'user1', amount: 15.50 },
        { userId: 'user2', amount: 10.25 },
        { userId: 'user3', amount: 4.25 }
      ])
    })

    it('should round amounts to cents', () => {
      const customSplits: CustomSplit[] = [
        { userId: 'user1', amount: 15.555 },
        { userId: 'user2', amount: 14.445 }
      ]
      
      const result = splitCustom(30.00, customSplits)
      expect(result).toEqual([
        { userId: 'user1', amount: 15.56 },
        { userId: 'user2', amount: 14.45 }
      ])
    })

    it('should allow small rounding tolerance', () => {
      const customSplits: CustomSplit[] = [
        { userId: 'user1', amount: 10.00 },
        { userId: 'user2', amount: 10.01 } // 1 cent over
      ]
      
      expect(() => splitCustom(20.00, customSplits)).not.toThrow()
    })

    it('should reject splits that dont match total', () => {
      const customSplits: CustomSplit[] = [
        { userId: 'user1', amount: 15.00 },
        { userId: 'user2', amount: 10.00 }
      ]
      
      expect(() => splitCustom(30.00, customSplits)).toThrow(
        'Custom split total (25.00) does not match expense amount (30.00)'
      )
    })

    it('should throw error for empty splits array', () => {
      expect(() => splitCustom(10.00, [])).toThrow('Cannot create custom split with no users')
    })
  })

  describe('calculateBalance', () => {
    it('should calculate when user A owes user B', () => {
      // User A paid $10, owes $15 (net: -$5)
      // User B paid $20, owes $10 (net: +$10)
      // User A owes User B $15
      const balance = calculateBalance(10, 20, 15, 10)
      expect(balance).toBe(15)
    })

    it('should calculate when user B owes user A', () => {
      // User A paid $30, owes $10 (net: +$20)
      // User B paid $10, owes $30 (net: -$20)
      // User B owes User A $40
      const balance = calculateBalance(30, 10, 10, 30)
      expect(balance).toBe(-40)
    })

    it('should return zero when users are even', () => {
      // Both users paid $20, both owe $20 (net: $0 each)
      const balance = calculateBalance(20, 20, 20, 20)
      expect(balance).toBe(0)
    })

    it('should handle decimal amounts correctly', () => {
      // User A paid $15.50, owes $13.75 (net: +$1.75)
      // User B paid $12.25, owes $14.00 (net: -$1.75)
      // Balance should be -1.75 - 1.75 = -3.5 (User A owes User B $3.50)
      const balance = calculateBalance(15.50, 12.25, 13.75, 14.00)
      expect(balance).toBeCloseTo(-3.5, 2)
    })
  })
}) 