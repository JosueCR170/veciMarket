import { renderHook, act, waitFor } from '@testing-library/react';
import { UseMapElements } from '../hooks/useMapElements';
import { useAuth } from '../context/contextUsuario';
import { useLocationContext } from '../context/contextLocation';
import { GoogleMap } from '@capacitor/google-maps';
import * as vendedorService from '../services/firebase/vendedorService';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@capacitor/google-maps', () => ({
  GoogleMap: {
    create: vi.fn().mockResolvedValue({
      addMarker: vi.fn().mockResolvedValue({}),
      removeMarker: vi.fn(),
      setOnMapClickListener: vi.fn(),
      setOnMarkerClickListener: vi.fn(),
      removeAllMapListeners: vi.fn(),
      destroy: vi.fn(),
      setCamera: vi.fn(),
    }),
  },
}));

vi.mock('../context/contextUsuario', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../context/contextLocation', () => ({
  useLocationContext: vi.fn(),
}));

vi.mock('../hooks/useLocationTracker', () => ({
  useLocationTracker: vi.fn(() => ({
    requestPermissions: vi.fn(),
    getCurrentPosition: vi.fn().mockResolvedValue({
      coords: { latitude: 10, longitude: -84 },
      timestamp: Date.now(),
    }),
  })),
}));

vi.mock('../services/firebase/vendedorService', () => ({
  getVendedoresWithLocation: vi.fn(),
  updateVendedorLocation: vi.fn(),
}));

describe('UseMapElements hook', () => {
  const location = {
    coords: {
      latitude: 9.935,
      longitude: -84.091,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  };

  beforeEach(() => {
    // Crear div en el DOM para el mapa
    const div = document.createElement('div');
    div.id = 'test-map';
    document.body.appendChild(div);

    (useAuth as Mock).mockReturnValue({ user: { uid: '123' } });
    (useLocationContext as Mock).mockReturnValue({ setLoading: vi.fn() });
  });

  afterEach(() => {
    // Limpiar div del DOM
    const mapDiv = document.getElementById('test-map');
    if (mapDiv) {
      mapDiv.remove();
    }
  });

  it('debe crear el mapa con location válida', async () => {
    const { result } = renderHook(() =>
      UseMapElements(location, vi.fn(), 'test-map', false)
    );

    await waitFor(() => {
      expect(result.current.mapReady).toBe(true);
    }, { timeout: 2000 });

    expect(result.current.coordsSeleccionadas).toEqual({ lat: 9.935, lng: -84.091 });
  });

  it('no debe crear el mapa si no hay location ni coordsLocal', () => {
    const { result } = renderHook(() =>
      UseMapElements(null, vi.fn(), 'test-map', false)
    );

    expect(result.current.mapReady).toBe(false);
  });

  it('guarda la ubicación del usuario', async () => {
    (vendedorService.updateVendedorLocation as Mock).mockResolvedValue({ success: true });
    const refreshLocation = vi.fn();

    const { result } = renderHook(() =>
      UseMapElements(location, refreshLocation, 'test-map', false)
    );

    await act(async () => {
      // Usar Object.assign para mutar el objeto y que lo detecte React
      Object.assign(result.current, {
        coordsSeleccionadas: { lat: 9.935, lng: -84.091 },
      });
      await result.current.guardarUbicacion();
    });

    expect(refreshLocation).toHaveBeenCalled();
  });

  it('no guarda ubicación si no hay coordsSeleccionadas', async () => {
    const refreshLocation = vi.fn();
    const { result } = renderHook(() =>
      UseMapElements(location, refreshLocation, 'test-map', false)
    );

    await act(async () => {
      Object.assign(result.current, { coordsSeleccionadas: null });
      await result.current.guardarUbicacion();
    });

    expect(refreshLocation).not.toHaveBeenCalled();
  });

  it('no guarda ubicación si no hay usuario', async () => {
    (useAuth as Mock).mockReturnValueOnce({ user: null });
    const refreshLocation = vi.fn();

    const { result } = renderHook(() =>
      UseMapElements(location, refreshLocation, 'test-map', false)
    );

    await act(async () => {
      Object.assign(result.current, {
        coordsSeleccionadas: { lat: 9.935, lng: -84.091 },
      });
      await result.current.guardarUbicacion();
    });

    expect(refreshLocation).not.toHaveBeenCalled();
  });

  it('activa selección de ubicación', async () => {
    let clickCallback: (coords: { latitude: number; longitude: number }) => void = () => {};

    (GoogleMap.create as Mock).mockResolvedValue({
      addMarker: vi.fn().mockResolvedValue({}),
      setOnMapClickListener: vi.fn().mockImplementation((cb) => {
        clickCallback = cb;
      }),
      removeAllMapListeners: vi.fn(),
      destroy: vi.fn(),
      setCamera: vi.fn(),
    });

    const { result } = renderHook(() =>
      UseMapElements(location, vi.fn(), 'test-map', false)
    );

    await act(async () => {
      await result.current.activarSeleccionUbicacion();
      // Simula el click en el mapa que actualiza coordsSeleccionadas
      clickCallback({ latitude: 10.0, longitude: -84.0 });
    });

    expect(result.current.coordsSeleccionadas).toEqual({ lat: 10.0, lng: -84.0 });
  });
});
