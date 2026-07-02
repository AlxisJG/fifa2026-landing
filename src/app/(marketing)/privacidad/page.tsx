import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MarketingPageMain, PageIntro } from "@/components/layout/page-intro";
import { buildSocialMetadata } from "@/lib/seo/metadata-shared";
import { absoluteSiteUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";

const path = "/privacidad";
const title = "Política de Privacidad | PIO Deportes";
const description =
  "Conoce cómo PIO Deportes recopila, usa y protege tus datos personales en el sitio web y la aplicación móvil.";

const LAST_UPDATED = "30 de junio de 2026";
const PRIVACY_EMAIL = "privacidad@piodeportes.com";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteSiteUrl(path) },
  ...buildSocialMetadata({
    title,
    description,
    path,
    imageAlt: "Política de Privacidad — PIO Deportes"
  }),
  robots: { index: true, follow: true }
};

function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="border-t border-slate-200/80 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <MarketingPageMain>
      <PageIntro
        config={{
          h1: "Política de Privacidad",
          intro: `Última actualización: ${LAST_UPDATED}. Esta política describe cómo ${SITE_NAME} trata la información personal cuando utilizas nuestro sitio web y aplicación móvil.`
        }}
        kicker="Legal"
      />

      <section className="section-shell pb-16">
        <div className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <LegalSection heading="1. Responsable del tratamiento">
            <p>
              El responsable del tratamiento de tus datos personales es <strong>PIO Deportes</strong> (en adelante,
              &quot;nosotros&quot; o &quot;PIO Deportes&quot;), operador del sitio web{" "}
              <a href={SITE_URL} className="text-electric underline-offset-2 hover:underline">
                {SITE_URL.replace(/^https?:\/\//, "")}
              </a>{" "}
              y de la aplicación móvil PIO Deportes para iOS y Android.
            </p>
            <p>
              Para consultas sobre privacidad puedes escribir a{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-electric underline-offset-2 hover:underline">
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection heading="2. Ámbito de aplicación">
            <p>
              Esta política aplica cuando visitas nuestro sitio web, utilizas la aplicación móvil, te registras, inicias
              sesión, adquieres acceso a contenido de pago o interactúas con nuestras transmisiones y servicios
              deportivos.
            </p>
          </LegalSection>

          <LegalSection heading="3. Datos que recopilamos">
            <p>Podemos recopilar las siguientes categorías de información:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Datos de cuenta:</strong> nombre, correo electrónico, identificador de usuario y credenciales
                cuando te registras o inicias sesión.
              </li>
              <li>
                <strong>Datos de suscripción y compra:</strong> productos adquiridos, estado de acceso y referencias de
                transacción. Los datos de pago (tarjeta, etc.) son procesados por proveedores de pago externos; PIO
                Deportes no almacena números completos de tarjeta.
              </li>
              <li>
                <strong>Datos técnicos:</strong> dirección IP, país aproximado, tipo de dispositivo, sistema operativo,
                navegador, idioma e identificadores de sesión.
              </li>
              <li>
                <strong>Datos de uso:</strong> páginas visitadas, interacciones con contenido, eventos de reproducción
                de video y preferencias guardadas en el dispositivo (por ejemplo, descartar avisos de la app).
              </li>
              <li>
                <strong>Datos de la aplicación móvil:</strong> identificadores del dispositivo y, si activas las
                notificaciones push, el token necesario para enviarte alertas deportivas.
              </li>
            </ul>
          </LegalSection>

          <LegalSection heading="4. Finalidades del tratamiento">
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Prestar y mejorar nuestros servicios deportivos, noticias, estadísticas y transmisiones.</li>
              <li>Gestionar tu cuenta, autenticación y acceso a contenido de pago.</li>
              <li>Verificar elegibilidad geográfica para ciertos contenidos (por ejemplo, transmisión en vivo).</li>
              <li>Enviar comunicaciones operativas y, con tu consentimiento, notificaciones push.</li>
              <li>Medir audiencia, rendimiento y campañas publicitarias.</li>
              <li>Prevenir fraude, abusos y garantizar la seguridad de la plataforma.</li>
              <li>Cumplir obligaciones legales y responder solicitudes de autoridades competentes.</li>
            </ul>
          </LegalSection>

          <LegalSection heading="5. Cookies y tecnologías similares">
            <p>
              Utilizamos cookies, almacenamiento local y tecnologías equivalentes para mantener sesiones, recordar
              preferencias y analizar el uso del sitio. También empleamos herramientas de analítica y publicidad de
              terceros que pueden instalar sus propias cookies.
            </p>
            <p>
              Puedes configurar tu navegador para rechazar cookies, aunque algunas funciones del sitio podrían dejar
              de funcionar correctamente.
            </p>
          </LegalSection>

          <LegalSection heading="6. Proveedores y terceros">
            <p>Compartimos datos con proveedores que nos ayudan a operar el servicio, entre ellos:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Infraestructura de hosting y analítica web (por ejemplo, Vercel, Google Analytics).</li>
              <li>Plataformas de publicidad y medición (por ejemplo, Meta Pixel, Google Ads).</li>
              <li>Proveedores de video y streaming (por ejemplo, Brightcove).</li>
              <li>Plataformas de gestión de usuarios, productos y pagos asociadas a nuestro backend editorial.</li>
              <li>Servicios de notificaciones push (por ejemplo, Firebase Cloud Messaging) y tiendas de aplicaciones.</li>
            </ul>
            <p>
              Estos proveedores procesan datos conforme a sus propias políticas y solo en la medida necesaria para
              prestar el servicio contratado.
            </p>
          </LegalSection>

          <LegalSection heading="7. Transferencias internacionales">
            <p>
              Algunos proveedores pueden procesar datos fuera de República Dominicana. Cuando ello ocurre, adoptamos
              medidas razonables para garantizar un nivel adecuado de protección conforme a la legislación aplicable.
            </p>
          </LegalSection>

          <LegalSection heading="8. Conservación">
            <p>
              Conservamos los datos personales mientras mantengas una cuenta activa, mientras sea necesario para las
              finalidades descritas o mientras exija la ley. Los datos de analítica y registros técnicos se conservan
              por períodos limitados según necesidades operativas y obligaciones legales.
            </p>
          </LegalSection>

          <LegalSection heading="9. Seguridad">
            <p>
              Aplicamos medidas técnicas y organizativas razonables para proteger la información contra acceso no
              autorizado, pérdida o alteración. Ningún sistema en Internet es completamente seguro; te recomendamos
              usar contraseñas robustas y no compartir tus credenciales.
            </p>
          </LegalSection>

          <LegalSection heading="10. Tus derechos">
            <p>
              De acuerdo con la legislación dominicana aplicable, incluida la Ley No. 172-13 sobre Protección de Datos
              de Carácter Personal, puedes solicitar:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Acceso a tus datos personales.</li>
              <li>Rectificación de datos inexactos o incompletos.</li>
              <li>Supresión o cancelación cuando corresponda.</li>
              <li>Oposición o limitación del tratamiento en los casos previstos por ley.</li>
            </ul>
            <p>
              Para ejercer estos derechos, escríbenos a{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-electric underline-offset-2 hover:underline">
                {PRIVACY_EMAIL}
              </a>{" "}
              indicando tu solicitud y un medio para verificar tu identidad.
            </p>
          </LegalSection>

          <LegalSection heading="11. Menores de edad">
            <p>
              Nuestros servicios no están dirigidos a menores de 18 años. Si detectamos que hemos recopilado datos de un
              menor sin el consentimiento parental correspondiente, tomaremos medidas para eliminarlos.
            </p>
          </LegalSection>

          <LegalSection heading="12. Enlaces a sitios de terceros">
            <p>
              El sitio puede contener enlaces a sitios externos. PIO Deportes no es responsable de las prácticas de
              privacidad de esos sitios. Te recomendamos leer sus políticas antes de proporcionar datos personales.
            </p>
          </LegalSection>

          <LegalSection heading="13. Cambios a esta política">
            <p>
              Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. Publicaremos la
              versión vigente en esta página e indicaremos la fecha de última actualización. El uso continuado del
              servicio después de los cambios implica tu aceptación de la política revisada.
            </p>
          </LegalSection>

          <LegalSection heading="14. Contacto">
            <p>
              Si tienes preguntas sobre esta Política de Privacidad o sobre el tratamiento de tus datos, contáctanos en{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`} className="text-electric underline-offset-2 hover:underline">
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </LegalSection>
        </div>
      </section>
    </MarketingPageMain>
  );
}
