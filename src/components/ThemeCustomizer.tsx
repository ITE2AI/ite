import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSettings } from '../types';

export function ThemeCustomizer() {
  const { theme, updateTheme } = useTheme();

  const handleColorChange = (key: keyof ThemeSettings, value: string) => {
    updateTheme({ [key]: value });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Personalizza Tema</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colore Primario
          </label>
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
            className="h-10 w-full rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colore Secondario
          </label>
          <input
            type="color"
            value={theme.secondaryColor}
            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
            className="h-10 w-full rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colore Sfondo
          </label>
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
            className="h-10 w-full rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}