// src/components/IntroScreen.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface IntroScreenProps {
  onStart: (player?: { name: string; phone: string }) => void; // ✅
  onSeeRewards: () => void;
  onRegisterPlayer: (name: string, phone: string) => void;
  initialName?: string;
  initialPhone?: string;
}


export function IntroScreen({
  onStart,
  onSeeRewards,
  onRegisterPlayer,
  initialName = '',
  initialPhone = '',
}: IntroScreenProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [touched, setTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Optionnel: garde le test seulement en dev
  useEffect(() => {
    if (import.meta.env.PROD) return;

    (async () => {
      console.log('🔌 TEST SUPABASE: connexion en cours…');
      const { data, error } = await supabase.from('participants').select('*').limit(1);
      console.log('🔍 TEST SELECT:', data, error);
    })();
  }, []);

  useEffect(() => {
    setName(initialName);
    setPhone(initialPhone);
  }, [initialName, initialPhone]);

  const cleanName = name.trim();
  const cleanPhone = phone.replace(/\s+/g, '').trim(); // enlève les espaces

  const isValid = cleanName.length > 1 && cleanPhone.length >= 8;

  const handleStartClick = async () => {
    setTouched(true);
    if (!isValid || isSaving) return;
  
    setIsSaving(true);
  
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\s+/g, "").trim();
    const payload = { name: cleanName, phone: cleanPhone };
  
    const { error } = await supabase.from("participants").insert(payload);
  
    setIsSaving(false);
  
    if (error) {
      alert(`Erreur Supabase: ${error.message}`);
      return;
    }
  
    // ✅ 1) on met à jour le state parent
    onRegisterPlayer(payload.name, payload.phone);
  
    // ✅ 2) on démarre immédiatement le jeu (sans attendre le state)
    onStart(payload); // <-- IMPORTANT (voir props ci-dessous)
  };
  

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold text-[#103452] mb-1">Nutri-Run 🎯</h1>
        <p className="text-sm text-[#4b5563]">
          Saisissez vos coordonnées pour participer au jeu et être éligible à la tombola Nutriome.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#111827]">Nom & prénom</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c9c6c]"
            placeholder="Ex : Dr. Mohamed Ali"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && cleanName.length <= 1 && (
            <p className="text-xs text-red-500">Merci d’indiquer votre nom complet.</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#111827]">Numéro de téléphone</label>
          <input
            type="tel"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c9c6c]"
            placeholder="Ex : 20 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && cleanPhone.length < 8 && (
            <p className="text-xs text-red-500">Merci d’indiquer un numéro valide.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <button
          type="button"
          onClick={handleStartClick}
          disabled={!isValid || isSaving}
          className={`w-full inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition
            ${isValid && !isSaving ? 'bg-[#1c9c6c] text-white hover:bg-[#158a5f]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
          `}
        >
          {isSaving ? 'Enregistrement...' : 'Commencer le jeu'}
        </button>

        {/* <button
          type="button"
          onClick={onSeeRewards}
          className="w-full inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium text-[#103452] border border-gray-200 hover:bg-gray-50"
        >
          Voir les cadeaux / tombola 🎁
        </button> */}
      </div>

      <p className="text-[11px] text-gray-400 mt-1">
        Vos coordonnées sont utilisées uniquement pour le tirage au sort de la tombola Nutriome.
      </p>
    </div>
  );
}
