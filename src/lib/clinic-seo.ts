/**
 * Phase 21: Clinic Profile & SEO Editor
 * 
 * JSON-LD Schema Generator for Google Search indexing
 * Structured data for dental clinic profiles
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ClinicProfile {
    id: string;
    name: string;
    slug: string; // URL-friendly name

    // Registration
    dciNumber: string;
    gstin?: string;
    establishedYear: number;

    // Location
    address: ClinicAddress;
    coordinates?: { lat: number; lng: number };

    // Contact
    phone: string;
    whatsapp?: string;
    email: string;
    website?: string;

    // 8-Department Mapping
    specialities: DentalSpeciality[];

    // Operating Hours
    operatingHours: OperatingHours[];

    // Staff
    doctors: DoctorProfile[];

    // Public Tariff
    publicTariff: PublicTariffItem[];

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];

    // Trust
    trustScore?: number;
    trustTier?: string;
    isVerified: boolean;

    // Social
    googleMapsUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
}

export interface ClinicAddress {
    streetAddress: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
}

export type DentalSpeciality =
    | 'general_dentistry'
    | 'orthodontics'
    | 'endodontics'
    | 'periodontics'
    | 'prosthodontics'
    | 'oral_surgery'
    | 'pediatric_dentistry'
    | 'cosmetic_dentistry';

export const SPECIALITY_LABELS: Record<DentalSpeciality, string> = {
    general_dentistry: 'General Dentistry',
    orthodontics: 'Orthodontics (Braces & Aligners)',
    endodontics: 'Endodontics (Root Canal)',
    periodontics: 'Periodontics (Gum Treatment)',
    prosthodontics: 'Prosthodontics (Crowns & Dentures)',
    oral_surgery: 'Oral & Maxillofacial Surgery',
    pediatric_dentistry: 'Pediatric Dentistry',
    cosmetic_dentistry: 'Cosmetic Dentistry'
};

export interface OperatingHours {
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    opens: string; // HH:MM format
    closes: string;
    isClosed: boolean;
}

export interface DoctorProfile {
    id: string;
    name: string;
    designation: string;
    dciNumber: string;
    qualification: string;
    speciality: DentalSpeciality;
    experience: number; // years
    photoUrl?: string;
}

export interface PublicTariffItem {
    id: string;
    category: DentalSpeciality;
    procedureName: string;
    procedureCode?: string;
    priceFrom: number;
    priceTo?: number;
    description?: string;
    isPopular: boolean;
}

// =============================================================================
// JSON-LD SCHEMA GENERATOR
// =============================================================================

export class SEOSchemaGenerator {
    /**
     * Generate main Dental Clinic schema
     */
    generateDentalClinicSchema(clinic: ClinicProfile): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'Dentist',
            '@id': `${clinic.website || `https://healthflo.in/clinic/${clinic.slug}`}`,
            'name': clinic.name,
            'description': clinic.metaDescription || `${clinic.name} - Professional dental care in ${clinic.address.city}`,
            'url': clinic.website || `https://healthflo.in/clinic/${clinic.slug}`,
            'telephone': clinic.phone,
            'email': clinic.email,
            'image': `https://healthflo.in/clinic/${clinic.slug}/logo.png`,
            'priceRange': this.getPriceRange(clinic.publicTariff),
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': clinic.address.streetAddress,
                'addressLocality': clinic.address.locality,
                'addressRegion': clinic.address.state,
                'postalCode': clinic.address.pincode,
                'addressCountry': 'IN'
            },
            ...(clinic.coordinates && {
                'geo': {
                    '@type': 'GeoCoordinates',
                    'latitude': clinic.coordinates.lat,
                    'longitude': clinic.coordinates.lng
                }
            }),
            'openingHoursSpecification': clinic.operatingHours
                .filter(h => !h.isClosed)
                .map(h => ({
                    '@type': 'OpeningHoursSpecification',
                    'dayOfWeek': h.dayOfWeek,
                    'opens': h.opens,
                    'closes': h.closes
                })),
            'hasOfferCatalog': {
                '@type': 'OfferCatalog',
                'name': 'Dental Services',
                'itemListElement': clinic.publicTariff.map(item => this.generateServiceSchema(item, clinic))
            },
            'medicalSpecialty': clinic.specialities.map(s => SPECIALITY_LABELS[s]),
            'availableService': clinic.specialities.map(s => ({
                '@type': 'MedicalProcedure',
                'name': SPECIALITY_LABELS[s]
            })),
            'employee': clinic.doctors.map(doc => this.generateDoctorSchema(doc)),
            ...(clinic.trustScore && {
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': (clinic.trustScore / 200).toFixed(1), // Convert 0-1000 to 0-5
                    'bestRating': '5',
                    'worstRating': '1',
                    'ratingCount': '100' // Placeholder
                }
            }),
            'sameAs': [
                clinic.googleMapsUrl,
                clinic.facebookUrl,
                clinic.instagramUrl
            ].filter(Boolean)
        };
    }

    /**
     * Generate Service/Procedure schema
     */
    generateServiceSchema(item: PublicTariffItem, clinic: ClinicProfile): object {
        return {
            '@type': 'Offer',
            'itemOffered': {
                '@type': 'MedicalProcedure',
                'name': item.procedureName,
                'description': item.description || `Professional ${item.procedureName} at ${clinic.name}`,
                'procedureType': SPECIALITY_LABELS[item.category]
            },
            'price': item.priceFrom,
            'priceCurrency': 'INR',
            ...(item.priceTo && {
                'priceSpecification': {
                    '@type': 'PriceSpecification',
                    'minPrice': item.priceFrom,
                    'maxPrice': item.priceTo,
                    'priceCurrency': 'INR'
                }
            }),
            'seller': {
                '@type': 'Dentist',
                'name': clinic.name
            }
        };
    }

    /**
     * Generate Doctor/Dentist schema
     */
    generateDoctorSchema(doctor: DoctorProfile): object {
        return {
            '@type': 'Dentist',
            'name': doctor.name,
            'jobTitle': doctor.designation,
            'description': `${doctor.qualification} with ${doctor.experience} years of experience in ${SPECIALITY_LABELS[doctor.speciality]}`,
            ...(doctor.photoUrl && { 'image': doctor.photoUrl }),
            'medicalSpecialty': SPECIALITY_LABELS[doctor.speciality],
            'knowsAbout': SPECIALITY_LABELS[doctor.speciality]
        };
    }

    /**
     * Generate FAQ schema for common procedures
     */
    generateFAQSchema(clinic: ClinicProfile): object {
        const faqs = [
            {
                question: `What is the cost of dental implant at ${clinic.name}?`,
                answer: this.getPriceAnswer(clinic.publicTariff, 'Dental Implant')
            },
            {
                question: `What is the root canal treatment cost in ${clinic.address.city}?`,
                answer: this.getPriceAnswer(clinic.publicTariff, 'Root Canal')
            },
            {
                question: `Does ${clinic.name} offer orthodontic treatment?`,
                answer: clinic.specialities.includes('orthodontics')
                    ? `Yes, ${clinic.name} offers comprehensive orthodontic services including braces and clear aligners.`
                    : `Please contact ${clinic.name} for orthodontic referrals.`
            },
            {
                question: `What are the operating hours of ${clinic.name}?`,
                answer: this.formatOperatingHours(clinic.operatingHours)
            }
        ];

        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        };
    }

    /**
     * Generate LocalBusiness schema for Google Maps
     */
    generateLocalBusinessSchema(clinic: ClinicProfile): object {
        return {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${clinic.website || `https://healthflo.in/clinic/${clinic.slug}`}#localbusiness`,
            'name': clinic.name,
            'image': `https://healthflo.in/clinic/${clinic.slug}/storefront.jpg`,
            'telephone': clinic.phone,
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': clinic.address.streetAddress,
                'addressLocality': clinic.address.city,
                'addressRegion': clinic.address.state,
                'postalCode': clinic.address.pincode,
                'addressCountry': 'IN'
            },
            ...(clinic.coordinates && {
                'geo': {
                    '@type': 'GeoCoordinates',
                    'latitude': clinic.coordinates.lat,
                    'longitude': clinic.coordinates.lng
                }
            }),
            'areaServed': {
                '@type': 'City',
                'name': clinic.address.city
            },
            'hasMap': clinic.googleMapsUrl
        };
    }

    /**
     * Generate all schemas as a combined script tag
     */
    generateAllSchemas(clinic: ClinicProfile): string {
        const schemas = [
            this.generateDentalClinicSchema(clinic),
            this.generateFAQSchema(clinic),
            this.generateLocalBusinessSchema(clinic)
        ];

        return `<script type="application/ld+json">
${JSON.stringify(schemas, null, 2)}
</script>`;
    }

    // Helper methods
    private getPriceRange(tariff: PublicTariffItem[]): string {
        if (tariff.length === 0) return '₹₹';
        const prices = tariff.map(t => t.priceFrom);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (max > 50000) return '₹₹₹₹';
        if (max > 20000) return '₹₹₹';
        if (max > 5000) return '₹₹';
        return '₹';
    }

    private getPriceAnswer(tariff: PublicTariffItem[], procedureKeyword: string): string {
        const item = tariff.find(t =>
            t.procedureName.toLowerCase().includes(procedureKeyword.toLowerCase())
        );
        if (!item) return 'Please contact us for current pricing.';
        if (item.priceTo) {
            return `${item.procedureName} costs ₹${item.priceFrom.toLocaleString('en-IN')} to ₹${item.priceTo.toLocaleString('en-IN')}.`;
        }
        return `${item.procedureName} starts at ₹${item.priceFrom.toLocaleString('en-IN')}.`;
    }

    private formatOperatingHours(hours: OperatingHours[]): string {
        const open = hours.filter(h => !h.isClosed);
        if (open.length === 0) return 'Please contact us for operating hours.';

        const grouped = new Map<string, string[]>();
        open.forEach(h => {
            const key = `${h.opens} - ${h.closes}`;
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key)!.push(h.dayOfWeek);
        });

        return Array.from(grouped.entries())
            .map(([time, days]) => `${days.join(', ')}: ${time}`)
            .join('. ');
    }
}

export const seoSchemaGenerator = new SEOSchemaGenerator();
