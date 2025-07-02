import React, { useState } from "react";
import { BatteryLow, BatteryMedium, BatteryFull, Sun, Clock, MoonStar } from "lucide-react";

/**
 * EcoplanetCalculator
 * -------------------
 * Dieser Multistep-Wizard führt durch 5 Schritte:
 *  0: Jahr der Beschaffung wählen
 *  1: Energieverbrauch wählen
 *  2: Schichtmodell wählen
 *  3: Arbeitspreis (Slider)
 *  4: Ergebnis-Seite
 */
export default function EcoplanetCalculator() {
  const [step, setStep] = useState(0);
  const [jahr, setJahr] = useState("");
  const [verbrauch, setVerbrauch] = useState("");
  const [schichtmodell, setSchichtmodell] = useState("");
  const [arbeitspreis, setArbeitspreis] = useState(0.20);
  const [ecoplanetPreis, setEcoplanetPreis] = useState(0);
  const [savingsPercent, setSavingsPercent] = useState(0);
  const [einsparungTotal, setEinsparungTotal] = useState({ min: 0, max: null });

  const jahrOptions = [
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
    { label: "2028", value: "2028" },
  ];

  const verbrauchOptions = [
    { label: "< 2 GWh", value: "unter2", icon: BatteryLow },
    { label: "2–10 GWh", value: "zwischen2und10", icon: BatteryMedium },
    { label: "> 10 GWh", value: "ueber10", icon: BatteryFull },
  ];

  const schichtOptions = [
    { label: "1-Schicht", value: "1schicht", icon: Sun },
    { label: "2-Schicht", value: "2schicht", icon: Clock },
    { label: "3-Schicht", value: "3schicht", icon: MoonStar },
  ];

  function formatPreis(val) {
    return (val * 100).toFixed(1).replace('.', ',');
  }

  function nextStep() {
    if (step === 0 && !jahr) return alert('Bitte wählen Sie ein Jahr aus.');
    if (step === 1 && !verbrauch) return alert('Bitte wählen Sie einen Energieverbrauch aus.');
    if (step === 2 && !schichtmodell) return alert('Bitte wählen Sie ein Schichtmodell aus.');
    if (step === 3) { calculateResults(); setStep(4); return; }
    setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  function calculateResults() {
    let basePrice = jahr === '2027' ? 0.072 : jahr === '2028' ? 0.069 : 0.078;
    const randomFactor = 1 + (Math.random() * 0.06 - 0.03);
    const ecoPrice = basePrice * randomFactor;
    setEcoplanetPreis(ecoPrice);

    const percent = (arbeitspreis - ecoPrice) / arbeitspreis;
    setSavingsPercent(percent);

    const diff = arbeitspreis - ecoPrice;
    let minSave = 0, maxSave = null;
    if (verbrauch === 'unter2') maxSave = diff * 2_000_000;
    else if (verbrauch === 'zwischen2und10') {
      minSave = diff * 2_000_000;
      maxSave = diff * 10_000_000;
    } else minSave = diff * 10_000_000;

    setEinsparungTotal({ min: minSave, max: maxSave });
  }

  function renderOption(option, selected, onSelect) {
    return (
      <div
        key={option.value}
        onClick={() => onSelect(option.value)}
        className={`cursor-pointer border-2 rounded p-4 text-center flex flex-col items-center gap-2 ${selected === option.value ? 'border-[#00852e]' : 'border-[#eee]'}`}
      >
        {option.icon && <option.icon size={24} />}
        <span>{option.label}</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 font-[Geistvf] text-[#222]">
      <div className="mb-6 text-center text-[#888]">
        {step < 4 ? `Schritt ${step + 1} von 5` : 'Ergebnis'}
      </div>

      {step === 0 && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">Jahr wählen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {jahrOptions.map(opt => renderOption(opt, jahr, setJahr))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">Verbrauch wählen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {verbrauchOptions.map(opt => renderOption(opt, verbrauch, setVerbrauch))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">Schichtmodell wählen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {schichtOptions.map(opt => renderOption(opt, schichtmodell, setSchichtmodell))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">Arbeitspreis eingeben</h2>
          <div className="px-4 mb-8">
            <input
              type="range"
              min={0}
              max={0.40}
              step={0.001}
              value={arbeitspreis}
              onChange={e => setArbeitspreis(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-right mt-2 font-semibold text-[#00852e]">{formatPreis(arbeitspreis)} ct/kWh</div>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="relative bg-white border border-[#eee] rounded-lg p-4 md:p-6 mb-6">
            <div className="absolute top-4 left-4 text-[#00852e]">
              <p className="text-sm md:text-base">Ihre Einsparung</p>
              <p className="text-xl md:text-2xl font-bold">{(savingsPercent * 100).toFixed(2)} %</p>
            </div>
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-xs md:text-sm text-[#888] text-center">Ihr möglicher Strompreis mit ecoplanet im Jahr {jahr}</p>
              <p className="text-4xl md:text-5xl font-extrabold text-[#00852e] mt-2">{formatPreis(ecoplanetPreis)} ct/kWh</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <a href="https://www.ecoplanet.tech/unternehmen/produktdemo" target="_blank" rel="noopener noreferrer" className="bg-[#00852e] text-white px-4 py-2 rounded">
              Jetzt Angebot sichern
            </a>
          </div>
        </>
      )}

      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button onClick={prevStep} className="bg-[#eee] text-[#222] px-4 py-2 rounded">
            Zurück
          </button>
        )}
        <div className="ml-auto">
          {step < 3 && (
            <button onClick={nextStep} className="bg-[#00852e] text-white px-4 py-2 rounded">
              Weiter
            </button>
          )}
          {step === 3 && (
            <button onClick={nextStep} className="bg-[#00852e] text-white px-4 py-2 rounded">
              Berechnen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
