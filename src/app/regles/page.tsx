import { PageContainer } from "@/components/layout/PageContainer";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { Card } from "@/components/ui/Card";
import { NUZLOCKE_NOTES, NUZLOCKE_RULES } from "@/data/rules";

export default function ReglesPage() {
  return (
    <>
      <TopAppBar
        title="Règles du Nuzlocke"
        subtitle="Les fondamentaux du défi"
      />
      <PageContainer className="flex flex-col gap-4">
        {NUZLOCKE_RULES.map((rule) => (
          <Card key={rule.title} className="p-4">
            <h2 className="md-title-medium text-[var(--md-sys-color-on-surface)]">
              {rule.title}
            </h2>
            <p className="mt-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
              {rule.description}
            </p>
          </Card>
        ))}

        <Card className="p-4 bg-[var(--md-sys-color-surface-container-low)]">
          <h2 className="md-title-small text-[var(--md-sys-color-on-surface)]">Notes</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {NUZLOCKE_NOTES.map((note) => (
              <li
                key={note}
                className="md-body-medium text-[var(--md-sys-color-on-surface-variant)] pl-4 relative before:content-['•'] before:absolute before:left-0"
              >
                {note}
              </li>
            ))}
          </ul>
        </Card>
      </PageContainer>
    </>
  );
}
