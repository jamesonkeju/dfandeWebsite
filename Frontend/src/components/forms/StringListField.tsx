import { FieldArray, Field } from "formik";
import { Plus, Trash2 } from "lucide-react";

// Extracted from the original inline `scope` FieldArray in
// ServiceFormPage.tsx — same Add/Remove UX, reused wherever a Formik field
// is a plain string[] (Service.Scope, Product.Items, and now any List-typed
// ContentBlock).
export function StringListField({ name, values }: { name: string; values: string[] }) {
  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="space-y-2">
          {values.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Field
                name={`${name}.${index}`}
                className="w-full rounded-lg border border-line px-4 py-2 text-sm outline-none focus:border-gold-dark"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-none rounded-lg border border-line px-2 text-ink-soft hover:border-danger hover:text-danger"
                aria-label="Remove item"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push("")}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gold-dark"
          >
            <Plus size={14} />
            Add item
          </button>
        </div>
      )}
    </FieldArray>
  );
}
