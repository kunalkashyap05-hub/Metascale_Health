import { BehaviorSubject } from 'rxjs';
import api from './api';

/**
 * HealthService — Angular-style Service for Healthcare Logic
 * Uses RxJS BehaviorSubject for data streams.
 * Properly initialized to prevent runtime crashes.
 */
class HealthService {
  constructor() {
    // Ensuring observables are available immediately upon instantiation
    this.predictionsSubject = new BehaviorSubject({
      loading: false,
      liver: null,
      diabetes: null,
      error: null,
      history: []
    });

    this.predictions$ = this.predictionsSubject.asObservable();
  }

  get currentPredictions() {
    return this.predictionsSubject.getValue();
  }

  async runScreening(type, data) {
    this.updateState({ loading: true, error: null });
    try {
      const endpoint = type === 'liver' ? '/predictions/liver' : '/predictions/diabetes';
      const response = await api.post(endpoint, data);
      
      const updatedPredictions = { ...this.currentPredictions };
      updatedPredictions[type] = response.data;
      updatedPredictions.loading = false;
      
      this.predictionsSubject.next(updatedPredictions);
      return response.data;
    } catch (err) {
      this.updateState({ 
        loading: false, 
        error: err.response?.data?.message || 'Prediction failed' 
      });
      throw err;
    }
  }

  async fetchHistory() {
    try {
      const response = await api.get('/predictions/history');
      this.updateState({ history: response.data });
    } catch (err) {
      console.error('History fetch failed', err);
    }
  }

  updateState(newState) {
    this.predictionsSubject.next({
      ...this.currentPredictions,
      ...newState
    });
  }
}

// LAZY SINGLETON: Prevents the minification crash ("ReferenceError: t is not defined").
// The top-level `new HealthService()` gets minified to `new t()` where `t` is undefined.
// By wrapping in a getter, we defer initialization until after the module is fully loaded.
let _instance = null;
const getInstance = () => {
  if (!_instance) _instance = new HealthService();
  return _instance;
};

export const healthService = {
  get predictions$() { return getInstance().predictions$; },
  get currentPredictions() { return getInstance().currentPredictions; },
  runScreening: (...args) => getInstance().runScreening(...args),
  fetchHistory: (...args) => getInstance().fetchHistory(...args),
  updateState: (...args) => getInstance().updateState(...args),
};

export default healthService;
