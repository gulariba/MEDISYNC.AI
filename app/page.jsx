'use client';
import { Navbar, Hero, BigStatement, AIShowcase, ReportIntelligence } from '@/components/landing/sections-top';
import { AppointmentsQueue, DoctorPreview, CareJourney, PatientsSection, CTASection, Footer } from '@/components/landing/sections-bottom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-hidden">
      <Navbar />
      <Hero />
      <BigStatement />
      <AIShowcase />
      <ReportIntelligence />
      <AppointmentsQueue />
      <DoctorPreview />
      <CareJourney />
      <PatientsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
