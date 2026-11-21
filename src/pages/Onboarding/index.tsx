import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '@/src/services/firebase';
import { useAuth } from '@/src/context/AuthContext';
import { StepIndicator } from './components/StepIndicator';
import { StepIdentity } from './components/StepIdentity';
import { StepDream } from './components/StepDream';
import { StepAbout } from './components/StepAbout';
import { StepIdentityCard } from './components/StepIdentityCard';
import { OnboardingFormData } from './types';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, refreshProfile } = useAuth();

  const [formData, setFormData] = useState<OnboardingFormData>({
    displayName: '',
    dreamUniversity: '',
    dreamMajor: '',
    reason: '',
    ambisType: 'Si Ambis',
    collegePurpose: '',
    photoBase64: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setFormData({ ...formData, photoBase64: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        const MAX_SIZE = 400;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handleSaveAndComplete = async () => {
    setLoading(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      await setDoc(doc(db, 'users', userId), {
        ...formData,
        uid: userId,
        email: auth.currentUser?.email,
        onboardingCompleted: true,
        dreamCardCreated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      await refreshProfile();
      // Wait for AuthContext redirect
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {step < 4 && <StepIndicator currentStep={step} />}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepIdentity 
            formData={formData} 
            fileInputRef={fileInputRef}
            onPhotoUpload={handlePhotoUpload}
            onNameChange={(name) => setFormData({ ...formData, displayName: name })}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepDream 
            formData={formData}
            updateFormData={(data) => setFormData({ ...formData, ...data })}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepAbout 
            formData={formData}
            loading={loading}
            updateFormData={(data) => setFormData({ ...formData, ...data })}
            onFinalize={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepIdentityCard 
            formData={formData}
            userId={auth.currentUser?.uid || ''}
            loading={loading}
            onNavigate={handleSaveAndComplete}
            onEdit={() => setStep(3)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
