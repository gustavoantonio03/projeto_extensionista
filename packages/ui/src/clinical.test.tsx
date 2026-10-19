import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SeverityBadge, severityOrder } from "./components/SeverityBadge";
import { LineChart } from "./components/LineChart";
import { Tabs } from "./components/Tabs";
import { Select } from "./components/Select";
import { Field } from "./components/Field";

describe("Componentes clínicos @siglo/ui", () => {
  it("SeverityBadge mostra texto (não depende só de cor) e ordena criticidade", () => {
    render(<SeverityBadge level="critico" />);
    expect(screen.getByText("Crítico")).toBeInTheDocument();
    expect(severityOrder.critico).toBeLessThan(severityOrder.atencao);
    expect(severityOrder.atencao).toBeLessThan(severityOrder.estavel);
  });

  it("LineChart expõe resumo acessível e tabela equivalente", () => {
    render(
      <LineChart
        title="Peso"
        unit="kg"
        points={[
          { label: "Jan", value: 20 },
          { label: "Fev", value: 21 },
        ]}
      />
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("de 20 kg em Jan para 21 kg em Fev")
    );
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
  });

  it("LineChart sem pontos mostra mensagem de vazio", () => {
    render(<LineChart title="Peso" unit="kg" points={[]} />);
    expect(screen.getByText(/sem medições/i)).toBeInTheDocument();
  });

  it("Tabs troca de aba por clique e por seta do teclado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Seções"
        value="a"
        onChange={onChange}
        tabs={[
          { id: "a", label: "Aba A" },
          { id: "b", label: "Aba B", count: 3 },
        ]}
      />
    );
    expect(screen.getByRole("tab", { name: "Aba A" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: /Aba B/ }));
    expect(onChange).toHaveBeenCalledWith("b");

    screen.getByRole("tab", { name: "Aba A" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith("b");
  });

  it("Select dentro de Field é associado ao rótulo", async () => {
    const user = userEvent.setup();
    render(
      <Field label="Leito" htmlFor="leito">
        <Select id="leito" defaultValue="">
          <option value="">Todos</option>
          <option value="A1">A1</option>
        </Select>
      </Field>
    );
    const select = screen.getByLabelText("Leito");
    await user.selectOptions(select, "A1");
    expect(select).toHaveValue("A1");
  });
});
