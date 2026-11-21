import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import { CREDIT_MULTIPLIER } from "../lib/credits/credit.constants";

export function useCreditBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [dailyUsed, setDailyUsed] = useState<number>(0);
  const [dailyLimit, setDailyLimit] = useState<number>(100);
  const [nextBonusAt, setNextBonusAt] = useState<Date | null>(null);
  const [bonusAmount, setBonusAmount] = useState<number>(500);

  useEffect(() => {
    if (!user) return;
    
    const docRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setBalance(Math.floor((data.creditsUnits || 0) / CREDIT_MULTIPLIER));
        setDailyUsed(Math.ceil((data.dailyUsedUnits || 0) / CREDIT_MULTIPLIER));
        setDailyLimit(Math.floor((data.dailyLimitUnits || 1000) / CREDIT_MULTIPLIER));
        setBonusAmount(Math.floor((data.monthlyBonusUnits || 5000) / CREDIT_MULTIPLIER));
        if (data.lastMonthlyBonusAt) {
          const lastBonus = new Date(data.lastMonthlyBonusAt);
          const nextBonus = new Date(lastBonus.getFullYear(), lastBonus.getMonth() + 1, 1);
          setNextBonusAt(nextBonus);
        }
      }
    });

    return () => unsub();
  }, [user]);

  return { balance, dailyUsed, dailyLimit, nextBonusAt, bonusAmount };
}
