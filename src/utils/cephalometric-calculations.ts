/**
 * Cephalometric Angle Calculation Utilities
 * Pure mathematical functions for orthodontic analysis
 */

import { Point, CephalometricLandmark, CephalometricAngles, SkeletalClass, VerticalPattern } from '@/types/orthodontic.types';

/**
 * Calculate angle between three points (in degrees)
 * @param p1 First point
 * @param vertex Vertex point (angle is measured here)
 * @param p2 Second point
 * @returns Angle in degrees
 */
export function calculateAngle(p1: Point, vertex: Point, p2: Point): number {
    const vector1 = {
        x: p1.x - vertex.x,
        y: p1.y - vertex.y
    };

    const vector2 = {
        x: p2.x - vertex.x,
        y: p2.y - vertex.y
    };

    // Calculate angle using atan2
    const angle1 = Math.atan2(vector1.y, vector1.x);
    const angle2 = Math.atan2(vector2.y, vector2.x);

    let angle = (angle2 - angle1) * (180 / Math.PI);

    // Normalize to 0-360 range
    if (angle < 0) angle += 360;
    if (angle > 180) angle = 360 - angle;

    return Math.round(angle * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate SNA angle (Sella-Nasion-A Point)
 * Measures anteroposterior position of maxilla
 * Normal range: 80-84°
 */
export function calculateSNA(S: Point, N: Point, A: Point): number {
    return calculateAngle(S, N, A);
}

/**
 * Calculate SNB angle (Sella-Nasion-B Point)
 * Measures anteroposterior position of mandible
 * Normal range: 78-82°
 */
export function calculateSNB(S: Point, N: Point, B: Point): number {
    return calculateAngle(S, N, B);
}

/**
 * Calculate ANB angle
 * Determines skeletal relationship (Class I/II/III)
 * ANB = SNA - SNB
 * Normal range: 2-4°
 */
export function calculateANB(sna: number, snb: number): number {
    return Math.round((sna - snb) * 10) / 10;
}

/**
 * Calculate Frankfort-Mandibular Angle (FMA)
 * Measures vertical growth pattern
 * Normal range: 25° ± 5°
 */
export function calculateFMA(Or: Point, Po: Point, Go: Point, Gn: Point): number {
    // Frankfort Horizontal: line from Orbitale to Porion
    // Mandibular Plane: line from Gonion to Gnathion

    // Calculate slopes
    const frankfortSlope = (Po.y - Or.y) / (Po.x - Or.x);
    const mandibularSlope = (Gn.y - Go.y) / (Gn.x - Go.x);

    // Calculate angle between two lines
    const angleRad = Math.abs(Math.atan(
        (mandibularSlope - frankfortSlope) / (1 + mandibularSlope * frankfortSlope)
    ));

    return Math.round(angleRad * (180 / Math.PI) * 10) / 10;
}

/**
 * Classify skeletal pattern based on ANB angle
 */
export function classifySkeletalPattern(anb: number): SkeletalClass {
    if (anb < 0) return 'Class III'; // Mandibular prognathism
    if (anb > 4) return 'Class II'; // Maxillary protrusion
    return 'Class I'; // Normal relationship
}

/**
 * Assess vertical growth pattern from FMA
 */
export function assessVerticalGrowth(fma: number): VerticalPattern {
    if (fma > 30) return 'High Angle'; // Vertical grower, long face
    if (fma < 20) return 'Low Angle'; // Horizontal grower, short face
    return 'Normal';
}

/**
 * Calculate all cephalometric angles from landmarks
 */
export function calculateAllAngles(landmarks: Record<string, CephalometricLandmark>): CephalometricAngles {
    const S = { x: landmarks['S'].x, y: landmarks['S'].y };
    const N = { x: landmarks['N'].x, y: landmarks['N'].y };
    const A = { x: landmarks['A'].x, y: landmarks['A'].y };
    const B = { x: landmarks['B'].x, y: landmarks['B'].y };
    const Or = { x: landmarks['Or'].x, y: landmarks['Or'].y };
    const Po = { x: landmarks['Po'].x, y: landmarks['Po'].y };
    const Go = { x: landmarks['Go'].x, y: landmarks['Go'].y };
    const Gn = { x: landmarks['Gn'].x, y: landmarks['Gn'].y };

    const SNA = calculateSNA(S, N, A);
    const SNB = calculateSNB(S, N, B);
    const ANB = calculateANB(SNA, SNB);
    const FMA = calculateFMA(Or, Po, Go, Gn);

    return {
        SNA,
        SNB,
        ANB,
        FMA,
        skeletalClass: classifySkeletalPattern(ANB),
        verticalPattern: assessVerticalGrowth(FMA),
        calculatedAt: new Date().toISOString()
    };
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate perpendicular distance from point to line
 * Used for E-Line measurements
 */
export function distancePointToLine(point: Point, lineP1: Point, lineP2: Point): number {
    const A = lineP2.y - lineP1.y;
    const B = lineP1.x - lineP2.x;
    const C = lineP2.x * lineP1.y - lineP1.x * lineP2.y;

    const distance = Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);

    // Determine sign (positive if protrusive)
    const crossProduct = (lineP2.x - lineP1.x) * (point.y - lineP1.y) - (lineP2.y - lineP1.y) * (point.x - lineP1.x);

    return Math.round(distance * 10) / 10 * (crossProduct > 0 ? 1 : -1);
}

/**
 * Validate that all required landmarks are present
 */
export function validateLandmarks(landmarks: Record<string, CephalometricLandmark>): {
    valid: boolean;
    missing: string[];
} {
    const required: string[] = ['S', 'N', 'A', 'B', 'Or', 'Po', 'Go', 'Gn'];
    const missing = required.filter(name => !landmarks[name]);

    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Bolton's Tooth Size Standards (average mesiodistal widths in mm)
 * Used as default values in ALD calculator
 */
export const BOLTON_STANDARDS: Record<number, number> = {
    // Maxillary
    11: 8.5, 12: 6.6, 13: 7.6, 14: 7.0, 15: 6.5, 16: 10.0, 17: 9.5,
    21: 8.5, 22: 6.6, 23: 7.6, 24: 7.0, 25: 6.5, 26: 10.0, 27: 9.5,
    // Mandibular
    31: 5.0, 32: 5.8, 33: 6.5, 34: 7.0, 35: 7.0, 36: 11.0, 37: 10.5,
    41: 5.0, 42: 5.8, 43: 6.5, 44: 7.0, 45: 7.0, 46: 11.0, 47: 10.5
};
