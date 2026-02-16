import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Scan, AlertCircle, ArrowLeft, RefreshCw, Smartphone, Camera } from 'lucide-react';
import IngredientAnalysis from '../components/IngredientAnalysis';
import type { AnalysisResponse } from '../../api/types';
import { Link } from 'react-router-dom';

const BarcodeScannerPage = () => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
    const [activeCameraId, setActiveCameraId] = useState<string | null>(null);

    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isMounted = useRef(true);

    const playBeep = () => {
        try {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;

            const audioCtx = new AudioContextClass();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);

            setTimeout(() => {
                if (audioCtx.state !== 'closed') audioCtx.close();
            }, 200);
        } catch (e) {
            console.warn("Beep failed", e);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        Html5Qrcode.getCameras().then(devices => {
            if (isMounted.current && devices && devices.length) {
                setCameras(devices);
                setActiveCameraId(devices[devices.length - 1].id);
            }
        }).catch(err => {
            console.error("Error getting cameras", err);
            setError("Could not access camera. Please check permissions.");
        });

        return () => {
            isMounted.current = false;
            stopScanner();
        };
    }, []);

    const startScanner = async (cameraId?: string) => {
        const idToUse = typeof cameraId === 'string' ? cameraId : activeCameraId;
        if (!idToUse) return;

        // If already scanning the same camera, skip
        if (isScanning && scannerRef.current && !cameraId) return;

        try {
            setError(null);

            // 1. Cleanup old instance
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.isScanning) await scannerRef.current.stop();
                    scannerRef.current.clear();
                } catch (e) { console.warn("Cleanup error", e); }
                scannerRef.current = null;
            }

            // 2. Delay slightly to let the camera resource release
            await new Promise(r => setTimeout(r, 100));

            const scanner = new Html5Qrcode("reader", {
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.CODE_128
                ],
                verbose: false
            });
            scannerRef.current = scanner;

            await scanner.start(
                idToUse,
                {
                    fps: 15,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => { /* ignore frame errors */ }
            );

            if (isMounted.current) {
                setIsScanning(true);
                setError(null);
            }
        } catch (err) {
            console.error("Failed to start scanner", err);
            if (isMounted.current) {
                setError("Failed to start camera. Please ensure permissions are granted.");
                setIsScanning(false);
            }
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner", err);
            }
            scannerRef.current = null;
        }
        if (isMounted.current) {
            setIsScanning(false);
        }
    };

    const handleScanSuccess = async (decodedText: string) => {
        if (loading || scanResult) return;

        playBeep();

        // Stop scanning immediately
        await stopScanner();

        setScanResult(decodedText);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/scan-barcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ barcode: decodedText }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch product data');
            }

            const data: AnalysisResponse = await response.json();
            if (isMounted.current) {
                setAnalysis(data);
            }

        } catch (err) {
            if (isMounted.current) {
                setError((err instanceof Error) ? err.message : 'An error occurred during scanning.');
                setScanResult(null);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setAnalysis(null);
        setError(null);
        setLoading(false);
        setIsScanning(false);
    };

    useEffect(() => {
        if (!activeCameraId) return;

        let timeoutId: NodeJS.Timeout;

        if (!analysis && !loading && !error && !isScanning && !scanResult) {
            timeoutId = setTimeout(() => {
                startScanner();
            }, 300);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [activeCameraId, analysis, loading, error, scanResult, isScanning]);

    return (
        <div className="min-h-screen bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Barcode Scanner - ingreBOARD</title>
                <meta name="description" content="Scan product barcodes to instantly analyze ingredients utilizing OpenFoodFacts data." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Scan className="text-emerald-500" />
                            Live Barcode Scanner
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Point your camera at a product barcode to analyze its ingredients instantly.
                        </p>
                    </div>
                </div>

                {/* Scanner Section */}
                {!analysis && !loading && !error && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">

                        {/* Camera Select if Multiple */}
                        {cameras.length > 1 && (
                            <div className="absolute top-4 right-4 z-20">
                                <select
                                    className="bg-gray-900 text-white text-sm rounded border border-gray-600 p-2"
                                    onChange={async (e) => {
                                        const newCameraId = e.target.value;
                                        await stopScanner();
                                        setActiveCameraId(newCameraId);
                                    }}
                                    value={activeCameraId || ''}
                                >
                                    {cameras.map(cam => (
                                        <option key={cam.id} value={cam.id}>{cam.label || `Camera ${cam.id.slice(0, 5)}...`}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div id="reader" className="w-full max-w-sm rounded-lg overflow-hidden bg-black relative">
                            {/* Overlay Guidelines */}
                            {isScanning && (
                                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                                    <div className="w-64 h-40 border-2 border-emerald-500/50 rounded-lg relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-red-500 animate-pulse top-1/2"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isScanning && !scanResult && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => startScanner()}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    <Camera size={20} /> Start Camera
                                </button>
                                <p className="text-gray-500 text-sm mt-3">
                                    Camera permission is required.
                                </p>
                            </div>
                        )}

                        <p className="text-center text-gray-500 text-sm mt-6">
                            Supported: EAN-13, EAN-8, UPC, Code 128
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center"
                    >
                        <RefreshCw className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-white mb-2">Analyzing Product...</h3>
                        <p className="text-gray-400">Fetching data from OpenFoodFacts & assessing risks.</p>
                        <p className="text-emerald-400 font-mono mt-4 text-sm">Barcode: {scanResult}</p>
                    </motion.div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-8 text-center"
                    >
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Scan Failed</h3>
                        <p className="text-red-200 mb-6">{error}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={resetScanner}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={20} /> Try Again
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Analysis Results */}
                {analysis && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Reset Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={resetScanner}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Scan size={20} /> Scan Another Product
                            </button>
                        </div>

                        <IngredientAnalysis data={analysis} />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default BarcodeScannerPage;
