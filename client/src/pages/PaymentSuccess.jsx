import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: true, error: '', download: null, meta: null });
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    async function confirm() {
      try {
        let token = params.get('token');
        const sessionId = params.get('session_id');
        let meta = null;
        if (!token && sessionId) {
          meta = await api.confirmStripe(sessionId);
          token = meta.token;
        }
        if (!token) {
          throw new Error('Missing payment confirmation details');
        }
        const download = await api.download(token);
        setState({ loading: false, error: '', download: { ...download, token }, meta });
        if (download.url) {
          window.open(download.url, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        setState({ loading: false, error: error.message, download: null, meta: null });
      }
    }
    confirm();
  }, [params]);

  async function downloadAgain() {
    if (!state.download?.token) return;
    const download = await api.download(state.download.token);
    window.open(download.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="font-display text-4xl text-leaf">Payment success</h1>
        {state.loading ? <p className="mt-4">Confirming your order…</p> : null}
        {state.error ? <p className="mt-4 font-bold text-red-600">{state.error}</p> : null}
        {state.download ? (
          <>
            <p className="mt-4 text-slate-700">
              {state.download.title} is ready. Downloads are tracked and the PDF is served from Cloudinary after
              server-side payment checks.
            </p>
            <button
              type="button"
              onClick={downloadAgain}
              className="mt-6 rounded-full bg-mango px-6 py-3 font-extrabold text-white"
            >
              Secure Download
            </button>
          </>
        ) : null}
        <Link to="/resources" className="mt-6 block font-bold text-sky-700">
          Back to resources
        </Link>
      </div>
    </div>
  );
}
