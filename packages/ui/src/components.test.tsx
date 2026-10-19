import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";
import { Chip } from "./components/Chip";
import { MoodPicker } from "./components/MoodPicker";
import { PainScale } from "./components/PainScale";
import { StatCard } from "./components/StatCard";
import { ProgressBar } from "./components/ProgressBar";

describe("Componentes @siglo/ui (Design System Acolher)", () => {
  it("Button renderiza texto e responde ao clique", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Avançar</Button>);

    const btn = screen.getByRole("button", { name: /avançar/i });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("Badge exibe variante semântica com sucesso", () => {
    render(<Badge variant="success">Tomado</Badge>);
    expect(screen.getByText("Tomado")).toBeInTheDocument();
  });

  it("Chip altera estado aria-pressed", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Chip selected={false} onClick={handleClick}>
        Gosto Metálico
      </Chip>
    );

    const chip = screen.getByRole("button", { name: /gosto metálico/i });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    await user.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("MoodPicker renderiza 3 opções de humor com rótulo textual visível", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<MoodPicker onChange={handleSelect} />);

    expect(screen.getByText("Estou Bem")).toBeInTheDocument();
    expect(screen.getByText("Mais ou Menos")).toBeInTheDocument();
    expect(screen.getByText("Preciso de Apoio")).toBeInTheDocument();

    const option = screen.getByRole("radio", { name: /estou bem/i });
    await user.click(option);
    expect(handleSelect).toHaveBeenCalledWith("bem");
  });

  it("PainScale permite selecionar parte do corpo e intensidade", async () => {
    const user = userEvent.setup();
    const handlePart = vi.fn();
    const handleIntensity = vi.fn();

    render(
      <PainScale
        onSelectPart={handlePart}
        onChangeIntensity={handleIntensity}
      />
    );

    const cabecaBtn = screen.getByRole("button", { name: /cabeça/i });
    await user.click(cabecaBtn);
    expect(handlePart).toHaveBeenCalledWith("cabeca");

    const forteBtn = screen.getByRole("button", { name: /forte/i });
    await user.click(forteBtn);
    expect(handleIntensity).toHaveBeenCalledWith("forte");
  });

  it("StatCard exibe métrica e rótulo", () => {
    render(<StatCard label="Peso" value="6.3" unit="kg" trend="up" />);
    expect(screen.getByText("Peso")).toBeInTheDocument();
    expect(screen.getByText("6.3")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  it("ProgressBar calcula porcentagem corretamente", () => {
    render(<ProgressBar value={50} max={100} label="Hidratação" showValue />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
