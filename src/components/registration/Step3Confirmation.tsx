import React, { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/sound';
import paymentQr from '../../assets/payment_qr.jpg';

interface Step3Props {
  formData: {
    teamName: string;
    college: string;
    leaderName: string;
    leaderEmail: string;
    leaderPhone: string;
    teamSize: number;
    transactionId?: string;
  };
  isSubmitting: boolean;
  onPrev: () => void;
  onConfirm: () => void;
  agreed?: boolean;
  setAgreed?: (val: boolean) => void;
  onChange?: (field: string, value: any) => void;
}

export const Step3Confirmation: React.FC<Step3Props> = ({
  formData,
  isSubmitting,
  onPrev,
  onConfirm,
  agreed: propAgreed,
  setAgreed: propSetAgreed,
  onChange
}) => {
  const [localAgreed, setLocalAgreed] = useState<boolean>(false);
  const agreed = propAgreed !== undefined ? propAgreed : localAgreed;
  const setAgreed = propSetAgreed !== undefined ? propSetAgreed : setLocalAgreed;
  const [localError, setLocalError] = useState<string>('');

  const handleSubmit = () => {
    let errMsg = '';
    if (!agreed) {
      errMsg = 'You must accept the official arena rulebook directives to confirm.';
    } else if (!formData.transactionId?.trim()) {
      errMsg = 'UPI Transaction ID / Ref No is required.';
    } else if (!/^\d{12}$/.test(formData.transactionId.trim())) {
      errMsg = 'Transaction ID must be a 12-digit number.';
    }

    if (errMsg) {
      setLocalError(errMsg);
      return;
    }
    setLocalError('');
    onConfirm();
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-3 text-left">
        <span className="text-xs font-mono text-[#00ff66] uppercase tracking-widest">[ STEP 03 / 03 ]</span>
        <h3 className="text-xl font-bold font-display text-white uppercase mt-1">
          MISSION CONFIRMATION
        </h3>
        <p className="text-xs font-mono text-slate-400">VERIFY ARENA SQUAD DIRECTIVES</p>
      </div>

      {/* Summary Box */}
      <div className="glass-panel p-6 rounded-lg border border-[#00ff66]/30 hud-box space-y-4 text-left font-mono text-xs">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="font-display font-extrabold text-base text-white">{formData.teamName}</span>
          <span className="text-[#00ff66] font-bold bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">
            SQUAD READY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block text-[10px]">COLLEGE / INSTITUTE:</span>
            <span className="text-slate-200 font-bold">{formData.college}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">TEAM LEADER:</span>
            <span className="text-slate-200 font-bold">{formData.leaderName}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">TEAM SIZE:</span>
            <span className="text-[#00f0ff] font-bold">{formData.teamSize} PARTICIPANTS</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">STARTING VIRTUAL BUDGET:</span>
            <span className="text-[#ffb700] font-bold">2000 POINTS</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase mb-1">COMPETITION MISSION STATEMENT:</span>
          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            Enter the arena, manage your component resources, design your schematic circuit, build your hardware solution, and defend your engineering decisions under judge panel defense.
          </p>
        </div>

      </div>

      {/* Payment Verification Section */}
      <div className="p-5 bg-[#07080c] border border-slate-800 rounded-lg space-y-4 font-mono text-xs">
        <h4 className="font-display font-bold text-white text-xs uppercase text-[#ff6b00] border-b border-slate-800 pb-2 text-left">
          ENTRY FEE PAYMENT REQUIRED // AMOUNT: ₹200
        </h4>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* QR Code Container */}
          <div className="flex flex-col items-center gap-2 bg-[#0e111a] p-4 rounded-xl border border-slate-800 w-full sm:w-auto shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="relative w-40 h-40 bg-white p-1 rounded-lg overflow-hidden border border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              {/* Image filling container */}
              <img
                src={paymentQr}
                alt="UPI Payment QR Code"
                className="w-full h-full object-contain bg-white"
              />
              {/* Laser scanner line effect */}
              <div className="absolute left-0 right-0 h-0.5 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff,0_0_20px_#00f0ff] animate-scan-line pointer-events-none" />
              {/* Corner tech marks */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#00f0ff]" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-[#00f0ff]" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-[#00f0ff]" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#00f0ff]" />
            </div>
            
            <div className="text-center font-mono text-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">UPI RECIPIENT:</span>
              <strong className="text-white text-sm block">Shubham Ghelani</strong>
              <code className="text-[#00f0ff] text-[10px] block mt-0.5 tracking-wider font-bold">ghelanishubham10@okaxis</code>
            </div>
          </div>

          {/* Instructions and Input */}
          <div className="flex-1 space-y-3 text-left w-full">
            <div className="text-slate-300 space-y-1 leading-relaxed text-[10px] font-sans">
              <p className="font-bold text-white uppercase font-mono text-[10px]">HOW TO RESOLVE TELEMETRY GATE FEE:</p>
              <ul className="list-decimal list-inside space-y-0.5 text-slate-400">
                <li>Scan the QR code with any UPI app.</li>
                <li>Pay the mandatory entry fee of <strong className="text-[#00ff66]">₹200</strong>.</li>
                <li>Copy the 12-digit transaction ID from the receipt.</li>
                <li>Input the ID below to close the security loop.</li>
              </ul>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 uppercase font-bold text-[9px]">UPI REFERENCE ID / REF NO (12 DIGITS) *</label>
              <input
                type="text"
                maxLength={12}
                placeholder="e.g. 320984712039"
                value={formData.transactionId || ''}
                onChange={(e) => onChange && onChange('transactionId', e.target.value.replace(/\D/g, ''))}
                className="w-full p-2 bg-[#07080c] border border-slate-800 focus:border-[#ff6b00] rounded text-white outline-none font-sans text-xs tracking-wider"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="p-4 bg-[#07080c] border border-slate-800 rounded-lg text-left">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              sound.playClick();
              setAgreed(e.target.checked);
              if (e.target.checked) setLocalError('');
            }}
            className="mt-0.5 w-4 h-4 accent-[#00ff66] rounded cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-200 leading-normal">
            I have read and agree to the official event rules, safety guidelines, component usage constraints, and scoring directives of CIRCUIT ARENA.
          </span>
        </label>
        {localError && (
          <p className="text-red-400 text-xs font-mono mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {localError}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#07080c] border border-slate-700 text-slate-300 font-mono text-xs rounded hover:border-slate-500"
        >
          &lt; BACK TO ROSTER
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-gradient-to-r from-[#00ff66] to-[#00f0ff] text-black font-display font-black text-xs uppercase rounded transition-all shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:scale-105"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> ENCRYPTING REGISTRATION...
            </span>
          ) : (
            '## CONFIRM REGISTRATION'
          )}
        </button>
      </div>

    </div>
  );
};
