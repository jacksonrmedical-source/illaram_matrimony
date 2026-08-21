'use client';

import { useState, useEffect } from 'react';
import { countryCodes } from '@/data/countryCodes';

const sanitizeCode = (code: string) => code.replace(/[^\d+]/g, '');

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  const [code, setCode] = useState('+91');
  const [local, setLocal] = useState('');

  useEffect(() => {
    if (value) {
      const match = value.match(/^(\+\d+)(.*)$/);
      if (match) {
        setCode(match[1]);
        setLocal(match[2]);
      }
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = sanitizeCode(e.target.value);
    setCode(newCode);
    onChange(newCode + local);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocal = e.target.value.replace(/[^\d\s]/g, '');
    setLocal(newLocal);
    onChange(code + newLocal);
  };

  return (
    <div className="flex gap-2">
      <select
        value={code}
        onChange={handleCodeChange}
        className="w-28 p-3 border border-gray-200 rounded-xl bg-white"
      >
        {countryCodes.map((c) => {
          const sanitized = sanitizeCode(c.code);
          return (
            <option key={`${sanitized}-${c.country}`} value={sanitized}>
              {c.code} {c.country}
            </option>
          );
        })}
      </select>
      <input
        type="tel"
        value={local}
        onChange={handleLocalChange}
        placeholder="Phone number"
        className="flex-1 p-3 border border-gray-200 rounded-xl"
      />
    </div>
  );
}