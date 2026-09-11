"use client";

import {
  AlertCircle,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  History,
  Link2,
  LoaderCircle,
  LogOut,
  Pencil,
  Pill,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type {
  AppTab,
  CareConnection,
  CareInvite,
  DoseLog,
  DoseStatus,
  Medication,
  MedicationSchedule,
  Profile,
} from "@/lib/types";

const WEEKDAYS = [
  { value: 0, short: "D", label: "Domingo" },
  { value: 1, short: "S", label: "Segunda" },
  { value: 2, short: "T", label: "Terça" },
  { value: 3, short: "Q", label: "Quarta" },
  { value: 4, short: "Q", label: "Quinta" },
  { value: 5, short: "S", label: "Sexta" },
  { value: 6, short: "S", label: "Sábado" },
] as const;

const COLORS = ["#0f766e", "#2563eb", "#7c3aed", "#dc2626", "#d97706", "#0891b2"];

const STATUS_LABEL: Record<DoseStatus, string> = {
  taken: "Tomado",
  missed: "Perdido",
  skipped: "Ignorado",
};

type ToastState = { kind: "success" | "error"; message: string } | null;

function formatTime(value: string) {
  return value.slice(0, 5);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function scheduledForToday(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function sameLocalDay(a: string, b: Date) {
  const date = new Date(a);
  return (
    date.getFullYear() === b.getFullYear() &&
    date.getMonth() === b.getMonth() &&
    date.getDate() === b.getDate()
  );
}

function createInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(8);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function AuthView() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName.trim() } },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else if (!data.session) {
        setMessage({
          type: "success",
          text: "Cadastro criado. Confira seu e-mail para confirmar a conta.",
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ type: "error", text: "E-mail ou senha inválidos." });
    }

    setBusy(false);
  }

  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="brand-mark large"><Pill size={30} /></div>
        <p className="eyebrow">CUIDADO QUE CABE NA ROTINA</p>
        <h1>Seus medicamentos organizados, sem complicação.</h1>
        <p>
          Horários, histórico e acompanhamento familiar em um só lugar. Um serviço digital
          pensado para apoiar a rotina, não substituir profissionais de saúde.
        </p>
        <div className="auth-features">
          <span><Check size={16} /> Rotina diária</span>
          <span><Check size={16} /> Histórico de doses</span>
          <span><Check size={16} /> Acompanhamento familiar</span>
        </div>
      </section>

      <section className="auth-card" aria-labelledby="auth-title">
        <div className="mobile-brand"><div className="brand-mark"><Pill size={22} /></div><strong>MediCare+</strong></div>
        <p className="eyebrow">BEM-VINDO</p>
        <h2 id="auth-title">{mode === "login" ? "Entre na sua conta" : "Crie sua conta"}</h2>
        <p className="muted">
          {mode === "login" ? "Acesse sua rotina de cuidados." : "Comece a organizar seus horários."}
        </p>

        <form onSubmit={handleSubmit} className="form-stack">
          {mode === "signup" && (
            <label>
              Nome
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Como você quer ser chamado?"
                minLength={2}
                required
              />
            </label>
          )}
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>

          {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

          <button className="button primary wide" disabled={busy} type="submit">
            {busy ? <LoaderCircle className="spin" size={18} /> : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          className="text-button"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage(null);
          }}
        >
          {mode === "login" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
        <p className="medical-note"><ShieldCheck size={15} /> Use somente dados de teste neste projeto acadêmico.</p>
      </section>
    </main>
  );
}

interface MedicationFormProps {
  userId: string;
  medication?: Medication;
  schedules: MedicationSchedule[];
  onClose: () => void;
  onSaved: () => Promise<void>;
  notify: (message: string, kind?: "success" | "error") => void;
}

function MedicationForm({ userId, medication, schedules, onClose, onSaved, notify }: MedicationFormProps) {
  const relatedSchedules = schedules.filter((schedule) => schedule.medication_id === medication?.id);
  const [name, setName] = useState(medication?.name ?? "");
  const [dosage, setDosage] = useState(medication?.dosage ?? "");
  const [form, setForm] = useState(medication?.form ?? "Comprimido");
  const [instructions, setInstructions] = useState(medication?.instructions ?? "");
  const [color, setColor] = useState(medication?.color ?? COLORS[0]);
  const [times, setTimes] = useState<string[]>(
    relatedSchedules.length ? relatedSchedules.map((schedule) => formatTime(schedule.time_of_day)) : ["08:00"],
  );
  const [weekdays, setWeekdays] = useState<number[]>(relatedSchedules[0]?.weekdays ?? [0, 1, 2, 3, 4, 5, 6]);
  const [busy, setBusy] = useState(false);

  function toggleWeekday(day: number) {
    setWeekdays((current) =>
      current.includes(day) ? current.filter((value) => value !== day) : [...current, day].sort(),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!weekdays.length || times.some((time) => !time)) {
      notify("Escolha pelo menos um dia e preencha todos os horários.", "error");
      return;
    }

    setBusy(true);
    const medicationPayload = {
      user_id: userId,
      name: name.trim(),
      dosage: dosage.trim(),
      form: form.trim(),
      instructions: instructions.trim(),
      color,
      active: true,
    };

    let medicationId = medication?.id;
    if (medicationId) {
      const { error } = await supabase.from("medications").update(medicationPayload).eq("id", medicationId);
      if (error) {
        notify("Não foi possível atualizar o medicamento.", "error");
        setBusy(false);
        return;
      }
      await supabase.from("medication_schedules").delete().eq("medication_id", medicationId);
    } else {
      const { data, error } = await supabase
        .from("medications")
        .insert(medicationPayload)
        .select("id")
        .single();
      if (error || !data) {
        notify("Não foi possível cadastrar o medicamento.", "error");
        setBusy(false);
        return;
      }
      medicationId = data.id;
    }

    const schedulePayload = times.map((time) => ({
      medication_id: medicationId!,
      user_id: userId,
      time_of_day: time,
      weekdays,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo",
      active: true,
      label: "",
    }));
    const { error: scheduleError } = await supabase.from("medication_schedules").insert(schedulePayload);

    if (scheduleError) {
      notify("Medicamento salvo, mas ocorreu um erro nos horários.", "error");
    } else {
      notify(medication ? "Medicamento atualizado." : "Medicamento cadastrado.");
      await onSaved();
      onClose();
    }
    setBusy(false);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="medication-form-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><p className="eyebrow">ROTINA</p><h2 id="medication-form-title">{medication ? "Editar medicamento" : "Novo medicamento"}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-grid two">
            <label>Medicamento<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Losartana" required /></label>
            <label>Dosagem<input value={dosage} onChange={(event) => setDosage(event.target.value)} placeholder="Ex.: 50 mg" required /></label>
          </div>
          <label>
            Forma
            <select value={form} onChange={(event) => setForm(event.target.value)}>
              <option>Comprimido</option><option>Cápsula</option><option>Gotas</option><option>Xarope</option><option>Injeção</option><option>Outro</option>
            </select>
          </label>
          <label>Orientação<input value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Ex.: tomar após o café" maxLength={500} /></label>
          <fieldset>
            <legend>Dias da semana</legend>
            <div className="weekday-row">
              {WEEKDAYS.map((day) => (
                <button key={day.value} type="button" className={`weekday ${weekdays.includes(day.value) ? "selected" : ""}`} onClick={() => toggleWeekday(day.value)} aria-label={day.label} aria-pressed={weekdays.includes(day.value)}>{day.short}</button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Horários</legend>
            <div className="time-list">
              {times.map((time, index) => (
                <div className="time-field" key={`${index}-${time}`}>
                  <input type="time" value={time} onChange={(event) => setTimes((current) => current.map((value, position) => position === index ? event.target.value : value))} required />
                  {times.length > 1 && <button className="icon-button danger" type="button" onClick={() => setTimes((current) => current.filter((_, position) => position !== index))} aria-label="Remover horário"><Trash2 size={17} /></button>}
                </div>
              ))}
              <button className="button secondary small" type="button" onClick={() => setTimes((current) => [...current, "12:00"])}><Plus size={16} /> Adicionar horário</button>
            </div>
          </fieldset>
          <fieldset>
            <legend>Cor de identificação</legend>
            <div className="color-row">
              {COLORS.map((option) => <button type="button" key={option} className={`color-dot ${color === option ? "selected" : ""}`} style={{ backgroundColor: option }} onClick={() => setColor(option)} aria-label={`Selecionar cor ${option}`} />)}
            </div>
          </fieldset>
          <div className="modal-actions">
            <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
            <button className="button primary" disabled={busy} type="submit">{busy ? <LoaderCircle className="spin" size={18} /> : "Salvar medicamento"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function MediCareApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<AppTab>("today");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [logs, setLogs] = useState<DoseLog[]>([]);
  const [connections, setConnections] = useState<CareConnection[]>([]);
  const [invites, setInvites] = useState<CareInvite[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>();
  const [inviteCode, setInviteCode] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const notificationTimers = useRef<number[]>([]);

  const userId = session?.user.id ?? null;
  const isOwnerView = Boolean(userId && selectedPatientId === userId);

  const notify = useCallback((message: string, kind: "success" | "error" = "success") => {
    setToast({ message, kind });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSelectedPatientId(data.session?.user.id ?? null);
      setAuthLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSelectedPatientId(nextSession?.user.id ?? null);
      setAuthLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const loadFamily = useCallback(async () => {
    if (!userId) return;
    const [profileResult, connectionsResult, invitesResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("care_connections").select("*").order("created_at", { ascending: false }),
      supabase.from("care_invites").select("*").eq("patient_id", userId).order("created_at", { ascending: false }),
    ]);

    const ownProfile = profileResult.data as Profile | null;
    const connectionRows = (connectionsResult.data ?? []) as CareConnection[];
    setProfile(ownProfile);
    setConnections(connectionRows);
    setInvites((invitesResult.data ?? []) as CareInvite[]);

    const relatedIds = Array.from(new Set(connectionRows.flatMap((row) => [row.patient_id, row.caregiver_id]).concat(userId)));
    const { data: relatedProfiles } = await supabase.from("profiles").select("*").in("id", relatedIds);
    const profileMap = Object.fromEntries(((relatedProfiles ?? []) as Profile[]).map((item) => [item.id, item]));
    if (ownProfile) profileMap[ownProfile.id] = ownProfile;
    setProfiles(profileMap);
  }, [userId]);

  const loadPatientData = useCallback(async () => {
    if (!selectedPatientId) return;
    setDataLoading(true);
    const start = new Date();
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    const [medicationResult, scheduleResult, logResult] = await Promise.all([
      supabase.from("medications").select("*").eq("user_id", selectedPatientId).order("created_at"),
      supabase.from("medication_schedules").select("*").eq("user_id", selectedPatientId).order("time_of_day"),
      supabase.from("dose_logs").select("*").eq("user_id", selectedPatientId).gte("scheduled_for", start.toISOString()).lt("scheduled_for", end.toISOString()).order("scheduled_for", { ascending: false }),
    ]);

    if (medicationResult.error || scheduleResult.error || logResult.error) {
      notify("Não foi possível carregar toda a rotina.", "error");
    }
    setMedications((medicationResult.data ?? []) as Medication[]);
    setSchedules((scheduleResult.data ?? []) as MedicationSchedule[]);
    setLogs((logResult.data ?? []) as DoseLog[]);
    setDataLoading(false);
  }, [notify, selectedPatientId]);

  useEffect(() => { void loadFamily(); }, [loadFamily]);
  useEffect(() => { void loadPatientData(); }, [loadPatientData]);

  const medicationMap = useMemo(() => Object.fromEntries(medications.map((medication) => [medication.id, medication])), [medications]);

  const todayItems = useMemo(() => {
    const weekday = new Date().getDay();
    return schedules
      .filter((schedule) => schedule.active && schedule.weekdays.includes(weekday) && medicationMap[schedule.medication_id]?.active)
      .map((schedule) => ({ schedule, medication: medicationMap[schedule.medication_id] }))
      .filter((item): item is { schedule: MedicationSchedule; medication: Medication } => Boolean(item.medication))
      .sort((a, b) => a.schedule.time_of_day.localeCompare(b.schedule.time_of_day));
  }, [medicationMap, schedules]);

  const todayLogs = useMemo(() => logs.filter((log) => sameLocalDay(log.scheduled_for, new Date())), [logs]);
  const todayLogBySchedule = useMemo(() => Object.fromEntries(todayLogs.filter((log) => log.schedule_id).map((log) => [log.schedule_id!, log])), [todayLogs]);
  const takenCount = todayLogs.filter((log) => log.status === "taken").length;
  const adherence = todayItems.length ? Math.round((takenCount / todayItems.length) * 100) : 0;

  const patientOptions = useMemo(() => {
    if (!userId) return [];
    const ids = [userId, ...connections.filter((connection) => connection.caregiver_id === userId).map((connection) => connection.patient_id)];
    return Array.from(new Set(ids)).map((id) => ({ id, name: profiles[id]?.display_name ?? (id === userId ? "Minha rotina" : "Familiar") }));
  }, [connections, profiles, userId]);

  useEffect(() => {
    notificationTimers.current.forEach(window.clearTimeout);
    notificationTimers.current = [];
    if (!notificationsEnabled || !isOwnerView || typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const now = Date.now();
    todayItems.forEach(({ schedule, medication }) => {
      const delay = new Date(scheduledForToday(schedule.time_of_day)).getTime() - now;
      if (delay > 0 && delay < 86_400_000) {
        notificationTimers.current.push(window.setTimeout(() => {
          new Notification(`Hora de ${medication.name}`, { body: `${medication.dosage} — ${medication.instructions || "Confira sua rotina no MediCare+."}` });
        }, delay));
      }
    });

    return () => notificationTimers.current.forEach(window.clearTimeout);
  }, [isOwnerView, notificationsEnabled, todayItems]);

  async function markDose(schedule: MedicationSchedule, medication: Medication, status: DoseStatus) {
    if (!userId || !isOwnerView) return;
    const scheduledFor = scheduledForToday(schedule.time_of_day);
    const payload = {
      user_id: userId,
      medication_id: medication.id,
      schedule_id: schedule.id,
      medication_name: medication.name,
      dosage: medication.dosage,
      scheduled_for: scheduledFor,
      status,
      taken_at: status === "taken" ? new Date().toISOString() : null,
      notes: "",
    };
    const { error } = await supabase.from("dose_logs").upsert(payload, { onConflict: "user_id,schedule_id,scheduled_for" });
    if (error) notify("Não foi possível registrar a dose.", "error");
    else {
      notify(`Dose marcada como ${STATUS_LABEL[status].toLowerCase()}.`);
      await loadPatientData();
    }
  }

  async function toggleMedication(medication: Medication) {
    const { error } = await supabase.from("medications").update({ active: !medication.active }).eq("id", medication.id);
    if (error) notify("Não foi possível alterar o medicamento.", "error");
    else await loadPatientData();
  }

  async function deleteMedication(medication: Medication) {
    if (!window.confirm(`Excluir ${medication.name}? O histórico de doses será preservado.`)) return;
    const { error } = await supabase.from("medications").delete().eq("id", medication.id);
    if (error) notify("Não foi possível excluir o medicamento.", "error");
    else {
      notify("Medicamento excluído.");
      await loadPatientData();
    }
  }

  async function createExample() {
    if (!userId) return;
    const { data, error } = await supabase.from("medications").insert({ user_id: userId, name: "Vitamina D", dosage: "1 cápsula", form: "Cápsula", instructions: "Tomar após o café da manhã", color: COLORS[4], active: true }).select("id").single();
    if (error || !data) return notify("Não foi possível criar o exemplo.", "error");
    await supabase.from("medication_schedules").insert({ medication_id: data.id, user_id: userId, time_of_day: "08:00", weekdays: [0, 1, 2, 3, 4, 5, 6], timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo", label: "Café da manhã", active: true });
    notify("Exemplo criado. Você pode editá-lo quando quiser.");
    await loadPatientData();
  }

  async function generateInvite() {
    if (!userId) return;
    const { error } = await supabase.from("care_invites").insert({ patient_id: userId, code: createInviteCode() });
    if (error) notify("Não foi possível gerar o convite.", "error");
    else {
      notify("Código familiar criado por 7 dias.");
      await loadFamily();
    }
  }

  async function acceptInvite() {
    const code = inviteCode.trim().toUpperCase();
    if (code.length !== 8) return notify("Digite um código de 8 caracteres.", "error");
    const { error } = await supabase.rpc("accept_care_invite", { invite_code: code });
    if (error) notify("Código inválido, expirado ou já utilizado.", "error");
    else {
      setInviteCode("");
      notify("Acompanhamento familiar ativado.");
      await loadFamily();
    }
  }

  async function removeConnection(connection: CareConnection) {
    if (!window.confirm("Remover este acesso familiar?")) return;
    const { error } = await supabase.from("care_connections").delete().eq("id", connection.id);
    if (error) notify("Não foi possível remover o acesso.", "error");
    else {
      notify("Acesso familiar removido.");
      await loadFamily();
    }
  }

  async function enableNotifications() {
    if (typeof Notification === "undefined") return notify("Este navegador não oferece notificações.", "error");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      notify("Lembretes ativados enquanto o sistema estiver aberto.");
    } else notify("A permissão de notificações não foi concedida.", "error");
  }

  if (authLoading) return <div className="loading-screen"><div className="brand-mark"><Pill size={24} /></div><LoaderCircle className="spin" /></div>;
  if (!session) return <AuthView />;

  const activeInvite = invites.find((invite) => !invite.accepted_at && new Date(invite.expires_at) > new Date());
  const ownerConnections = connections.filter((connection) => connection.patient_id === userId);
  const caregiverConnections = connections.filter((connection) => connection.caregiver_id === userId);

  const navItems: { id: AppTab; label: string; icon: typeof CalendarDays }[] = [
    { id: "today", label: "Hoje", icon: CalendarDays },
    { id: "medications", label: "Medicamentos", icon: Pill },
    { id: "history", label: "Histórico", icon: History },
    { id: "family", label: "Família", icon: Users },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><div className="brand-mark"><Pill size={22} /></div><div><strong>MediCare+</strong><span>Rotina de cuidados</span></div></div>
        <nav aria-label="Navegação principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><Icon size={19} />{item.label}</button>;
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="profile-mini"><span className="avatar" style={{ background: profile?.avatar_color }}>{profile?.display_name?.slice(0, 1).toUpperCase() || "U"}</span><div><strong>{profile?.display_name || "Usuário"}</strong><span>{session.user.email}</span></div></div>
          <button className="logout" onClick={() => supabase.auth.signOut()}><LogOut size={17} /> Sair</button>
        </div>
      </aside>

      <main className="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">MEDICARE+</p>
            <h1>{tab === "today" ? "Sua rotina de hoje" : navItems.find((item) => item.id === tab)?.label}</h1>
          </div>
          <div className="topbar-actions">
            {patientOptions.length > 1 && <label className="patient-select"><UserRound size={16} /><select aria-label="Selecionar rotina" value={selectedPatientId ?? ""} onChange={(event) => setSelectedPatientId(event.target.value)}>{patientOptions.map((option) => <option key={option.id} value={option.id}>{option.id === userId ? "Minha rotina" : option.name}</option>)}</select><ChevronDown size={14} /></label>}
            {tab === "today" && isOwnerView && <button className="button secondary" onClick={enableNotifications} disabled={notificationsEnabled}><Bell size={17} />{notificationsEnabled ? "Lembretes ativos" : "Ativar lembretes"}</button>}
          </div>
        </header>

        {!isOwnerView && <div className="read-only-banner"><ShieldCheck size={18} /><span>Você está acompanhando a rotina de <strong>{profiles[selectedPatientId ?? ""]?.display_name ?? "um familiar"}</strong>. Este acesso é somente para consulta.</span></div>}

        {dataLoading ? <div className="section-loader"><LoaderCircle className="spin" /><span>Carregando sua rotina...</span></div> : (
          <>
            {tab === "today" && (
              <section className="page-section">
                <div className="stats-grid">
                  <article className="stat-card"><span className="stat-icon teal"><CalendarDays size={20} /></span><div><span>Doses de hoje</span><strong>{todayItems.length}</strong></div></article>
                  <article className="stat-card"><span className="stat-icon green"><Check size={20} /></span><div><span>Tomadas</span><strong>{takenCount}</strong></div></article>
                  <article className="stat-card"><span className="stat-icon amber"><Clock3 size={20} /></span><div><span>Pendentes</span><strong>{Math.max(todayItems.length - todayLogs.length, 0)}</strong></div></article>
                  <article className="stat-card"><span className="stat-icon blue"><ShieldCheck size={20} /></span><div><span>Adesão hoje</span><strong>{adherence}%</strong></div></article>
                </div>

                <div className="section-heading"><div><h2>Próximos horários</h2><p>{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date())}</p></div>{isOwnerView && <button className="button primary" onClick={() => { setEditingMedication(undefined); setFormOpen(true); }}><Plus size={17} /> Novo medicamento</button>}</div>

                {todayItems.length ? <div className="schedule-list">
                  {todayItems.map(({ schedule, medication }) => {
                    const log = todayLogBySchedule[schedule.id];
                    return <article className={`schedule-card ${log ? `status-${log.status}` : ""}`} key={schedule.id}>
                      <div className="time-column"><strong>{formatTime(schedule.time_of_day)}</strong><span>{new Date(scheduledForToday(schedule.time_of_day)) < new Date() && !log ? "Atrasado" : "Horário"}</span></div>
                      <span className="medicine-color" style={{ backgroundColor: medication.color }} />
                      <div className="schedule-info"><h3>{medication.name}</h3><p>{medication.dosage} · {medication.form}</p>{medication.instructions && <span>{medication.instructions}</span>}</div>
                      {log ? <div className={`status-pill ${log.status}`}>{log.status === "taken" ? <Check size={16} /> : <AlertCircle size={16} />}{STATUS_LABEL[log.status]}</div> : isOwnerView ? <div className="dose-actions"><button className="button success" onClick={() => markDose(schedule, medication, "taken")}><Check size={16} /> Tomei</button><button className="icon-button" onClick={() => markDose(schedule, medication, "skipped")} aria-label="Ignorar dose"><X size={18} /></button><button className="icon-button danger" onClick={() => markDose(schedule, medication, "missed")} aria-label="Marcar como perdida"><AlertCircle size={18} /></button></div> : <span className="status-pill pending">Pendente</span>}
                    </article>;
                  })}
                </div> : <div className="empty-state"><span className="empty-icon"><Pill size={28} /></span><h3>Nenhum horário para hoje</h3><p>{isOwnerView ? "Cadastre seu primeiro medicamento ou crie um exemplo para conhecer o sistema." : "Este familiar ainda não possui uma rotina para hoje."}</p>{isOwnerView && <div><button className="button primary" onClick={() => { setEditingMedication(undefined); setFormOpen(true); }}><Plus size={17} /> Cadastrar medicamento</button><button className="button secondary" onClick={createExample}>Criar exemplo</button></div>}</div>}
              </section>
            )}

            {tab === "medications" && (
              <section className="page-section">
                <div className="section-heading"><div><h2>Medicamentos cadastrados</h2><p>Gerencie nomes, doses, dias e horários.</p></div>{isOwnerView && <button className="button primary" onClick={() => { setEditingMedication(undefined); setFormOpen(true); }}><Plus size={17} /> Novo medicamento</button>}</div>
                {medications.length ? <div className="medication-grid">{medications.map((medication) => {
                  const medSchedules = schedules.filter((schedule) => schedule.medication_id === medication.id);
                  return <article className={`medication-card ${!medication.active ? "inactive" : ""}`} key={medication.id}>
                    <div className="medication-card-top"><span className="medicine-icon" style={{ backgroundColor: `${medication.color}18`, color: medication.color }}><Pill size={22} /></span>{isOwnerView && <div className="card-actions"><button className="icon-button" onClick={() => { setEditingMedication(medication); setFormOpen(true); }} aria-label={`Editar ${medication.name}`}><Pencil size={17} /></button><button className="icon-button danger" onClick={() => deleteMedication(medication)} aria-label={`Excluir ${medication.name}`}><Trash2 size={17} /></button></div>}</div>
                    <h3>{medication.name}</h3><p className="medication-dose">{medication.dosage} · {medication.form}</p><p className="medication-instructions">{medication.instructions || "Sem orientação adicional."}</p>
                    <div className="schedule-chips">{medSchedules.map((schedule) => <span key={schedule.id}><Clock3 size={14} /> {formatTime(schedule.time_of_day)}</span>)}</div>
                    <div className="medication-footer"><span className={`active-label ${medication.active ? "on" : "off"}`}>{medication.active ? "Ativo" : "Pausado"}</span>{isOwnerView && <button className="text-button compact" onClick={() => toggleMedication(medication)}>{medication.active ? "Pausar" : "Reativar"}</button>}</div>
                  </article>;
                })}</div> : <div className="empty-state"><span className="empty-icon"><Pill size={28} /></span><h3>Nenhum medicamento cadastrado</h3><p>Cadastre um medicamento para montar sua rotina.</p>{isOwnerView && <button className="button primary" onClick={() => setFormOpen(true)}><Plus size={17} /> Cadastrar</button>}</div>}
              </section>
            )}

            {tab === "history" && (
              <section className="page-section">
                <div className="section-heading"><div><h2>Histórico dos últimos 30 dias</h2><p>Acompanhe os registros realizados no sistema.</p></div><div className="adherence-badge"><strong>{logs.length ? Math.round((logs.filter((log) => log.status === "taken").length / logs.length) * 100) : 0}%</strong><span>de adesão registrada</span></div></div>
                {logs.length ? <div className="history-list">{logs.map((log) => <article className="history-row" key={log.id}><span className={`history-status ${log.status}`}>{log.status === "taken" ? <Check size={17} /> : <AlertCircle size={17} />}</span><div><h3>{log.medication_name}</h3><p>{log.dosage} · previsto para {formatDate(log.scheduled_for)}</p></div><span className={`status-pill ${log.status}`}>{STATUS_LABEL[log.status]}</span></article>)}</div> : <div className="empty-state"><span className="empty-icon"><History size={28} /></span><h3>O histórico ainda está vazio</h3><p>Seus registros aparecerão aqui após marcar uma dose.</p></div>}
              </section>
            )}

            {tab === "family" && (
              <section className="page-section">
                <div className="section-heading"><div><h2>Acompanhamento familiar</h2><p>Compartilhe a rotina com alguém de confiança, em modo de leitura.</p></div></div>
                <div className="family-grid">
                  <article className="family-card"><span className="family-icon"><Link2 size={22} /></span><h3>Convidar um familiar</h3><p>O código vale por 7 dias e pode ser usado uma única vez.</p>{activeInvite ? <div className="invite-code"><span>Código ativo</span><strong>{activeInvite.code}</strong><small>Expira em {formatDate(activeInvite.expires_at)}</small></div> : <button className="button primary wide" onClick={generateInvite}>Gerar código de convite</button>}</article>
                  <article className="family-card"><span className="family-icon"><Users size={22} /></span><h3>Acompanhar alguém</h3><p>Digite o código fornecido pela pessoa que será acompanhada.</p><label className="code-input">Código<input value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))} placeholder="ABCD2345" maxLength={8} /></label><button className="button secondary wide" onClick={acceptInvite}>Ativar acompanhamento</button></article>
                </div>

                <div className="connection-section"><h3>Acessos ativos</h3>{ownerConnections.length + caregiverConnections.length ? <div className="connection-list">{ownerConnections.map((connection) => <article className="connection-row" key={connection.id}><span className="avatar small">{profiles[connection.caregiver_id]?.display_name?.slice(0, 1).toUpperCase() || "F"}</span><div><strong>{profiles[connection.caregiver_id]?.display_name || "Familiar"}</strong><span>Acompanha sua rotina</span></div><button className="icon-button danger" onClick={() => removeConnection(connection)} aria-label="Remover acesso"><Trash2 size={17} /></button></article>)}{caregiverConnections.map((connection) => <article className="connection-row" key={connection.id}><span className="avatar small">{profiles[connection.patient_id]?.display_name?.slice(0, 1).toUpperCase() || "P"}</span><div><strong>{profiles[connection.patient_id]?.display_name || "Pessoa acompanhada"}</strong><span>Você acompanha esta rotina</span></div><button className="button secondary small" onClick={() => { setSelectedPatientId(connection.patient_id); setTab("today"); }}>Ver rotina</button></article>)}</div> : <div className="empty-compact">Nenhum acesso familiar ativo.</div>}</div>
              </section>
            )}
          </>
        )}

        <footer className="app-footer"><ShieldCheck size={15} /> Projeto acadêmico. O MediCare+ não substitui diagnóstico, prescrição ou orientação de profissionais de saúde.</footer>
      </main>

      <nav className="mobile-nav" aria-label="Navegação móvel">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><Icon size={20} /><span>{item.label}</span></button>; })}</nav>

      {formOpen && userId && <MedicationForm userId={userId} medication={editingMedication} schedules={schedules} onClose={() => { setFormOpen(false); setEditingMedication(undefined); }} onSaved={loadPatientData} notify={notify} />}
      {toast && <div className={`toast ${toast.kind}`} role="status">{toast.kind === "success" ? <Check size={18} /> : <AlertCircle size={18} />}{toast.message}</div>}
    </div>
  );
}
