import { renderHook } from '@testing-library/react-hooks';

import useGeolocation from './useGeolocation';

const mockGeolocation = {
  query: jest.fn(),
  watchPosition: jest.fn().mockImplementation((success, error) => {
    setTimeout(() => {
      success({ coords: { latitude: 10, longitude: 20 } });
    }, 100);
    return 123;
  }),
  getCurrentPosition: jest.fn().mockImplementation((success, error) => {
    setTimeout(() => {
      success({ coords: { latitude: 10, longitude: 20 } });
    }, 100);
  }),
};

const mockPermissions = {
  query: jest.fn().mockResolvedValue({ state: 'granted' }),
};

(global.navigator as any).geolocation = mockGeolocation;
(global.navigator as any).permissions = mockPermissions;

describe('useGeolocation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('on mount', () => {
    it('requests geolocation if not suppressed', async () => {
      const { waitForNextUpdate } = renderHook(() => useGeolocation());

      await waitForNextUpdate();

      expect(mockPermissions.query).toHaveBeenCalledWith({ name: 'geolocation' });
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('does not request geolocation if suppressed', async () => {
      renderHook(() => useGeolocation({ suppressOnMount: true }));

      expect(mockPermissions.query).not.toHaveBeenCalled();
      expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();
    });
  });

  describe('geolocation results', () => {
    it('returns the correct geolocation data on success', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useGeolocation());

      await waitForNextUpdate();

      expect(result.current.coords).toEqual({ latitude: 10, longitude: 20 });
      expect(result.current.isEnabled).toBe(true);
      expect(result.current.isAvailable).toBe(true);
    });

    it('returns the correct data when geolocation is denied', async () => {
      mockPermissions.query.mockResolvedValueOnce({ state: 'denied' });

      const { result, waitForNextUpdate } = renderHook(() => useGeolocation());

      await waitForNextUpdate();

      expect(result.current.isEnabled).toBe(false);
      expect(result.current.isAvailable).toBe(true);
    });
  });

  describe('watch mode', () => {
    it('watches position if watchMode is enabled', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGeolocation({ watchMode: true })
      );

      await waitForNextUpdate();

      expect(mockGeolocation.watchPosition).toHaveBeenCalled();
      expect(result.current.watchId).toBe(123);
    });

    it('does not watch position if watchMode is disabled', async () => {
      const { waitForNextUpdate } = renderHook(() =>
        useGeolocation({ watchMode: false })
      );

      await waitForNextUpdate();

      expect(mockGeolocation.watchPosition).not.toHaveBeenCalled();
    });
  });
});
