import React, { useEffect, useMemo, useState, forwardRef } from "react";
import type { PresenzaStudente } from "../../models/Studente";
import type { LezioneCreate } from "../../models/Lezione";
import type { Lezione } from "../../models/Lezione";
import type { ClassRegisterMode } from "../../models/ClassRegisterMode";
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { popupAlert } from "../../shared/utils";

type LessonRowProps = {
  mode: ClassRegisterMode;

  // per dire se già collapsato o no inizialmente
  initialOpen?: boolean;

  // per view e edit ; in new non serve. Inoltre se arrivi da url non hai lezione ma solo suo id nell url
  lezione?: Lezione;

  //per poter mostrare invece che cf ( in lezione abbiamo solo quello su studenti) anche cognome nome
  allStudentByCfSorted: Record<string, { nome?: string; cognome?: string }>; // già ordinati sopra
  //da togliere non serve piu avendo studentByCf con tutti mappati e lezione con quelli da mostrare
  //allStudentiCfs?: string[];

  // Callback: per passare alle altre modalità
  onEdit: (lezione: Lezione) => void;
  onCancelEdit: () => void; //tornare in view annullando le modifiche
  // per salvare le modifiche o la new
  onSave: (payload: {
    // per submittare up le new e le edit
    id?: number; // solo in edit, no new
    dataLezione: string;
    studenti: PresenzaStudente[];
  }) => void;
  // per cancellarle direttamente
  onDeleteLesson?: (id: number) => void;
  //onDeleteStudent?: (lezioneId: number, cf: string) => {onSave(payload: {id: lezioneId, dataLezione= .., studenti: [tutti tranne uno eliminato, con destrutturazione]})}
};

const LessonRow = forwardRef<HTMLTableRowElement, LessonRowProps>( //react riceve ref, dopo mounting assegna ref e questo ref deve essere disponibile al padre.. roba grossa che si compoerta diversamente da cose lineari come le props o callbackprops ( cioè ad es ogni volta che rerender si aggiorna anche nel padr).. devi dirgli che vuoi fare sta roba perchè deve gestirla in modo diverso, e glielo si dice in questo modo strano , come se tutto il comp fosse diventato una func che passi ad un hook strano. approfondire
  (
    {
      mode,
      initialOpen = false, // TUTTO APPOSTO, PROPRIO QUA VA.  forse così non default (magari va messo in type) ma così settato. spero di no
      lezione,
      allStudentByCfSorted,
      onEdit,
      onCancelEdit,
      onSave,
      onDeleteLesson,
    }: LessonRowProps,
    ref
  ) => {
    // relativamente comodi ma sicuramente non scomodi: calcolate ad ogni update come ogni const sciolta. si tengono aggigonate
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isNew = mode === "new";

    // A VENIRE SMONTATO E' IL COLLAPSE, LA ROW RIMANE SEMPRE;  open è locale e NON viene resettato quando cambia la mode ( se cambia uno stato, non cambiano tutti)   => se una era già aperta, te la ritrovi rimane aperta
    const [open, setOpen] = useState<boolean>(initialOpen);

    // Stato utile per  form in  edit/new
    const [dataLezione, setDataLezione] = useState<string>(
      lezione?.dataLezione ?? ""
    );
    // !!!!!!!!!!! QUELLI VISUALIZZATI NELL ELENCO, NON PER FORZA PRESENTI ( edit e new li hanno tutti)
    const [presenze, setPresenze] = useState<
      Record<string, { present: boolean; ore: number }>
    >({});

    // errori locali (validazione client)
    const [errors, setErrors] = useState<{
      dataLezione?: string;
      studenti?: string;
      [k: string]: string | undefined;
    }>({});

  
    

    // 🔴 CF globali in ordine per non dover calcolare ogni volta senza motivo e per leggibilità e manutenibilità , in particolare nel redner
    const cfsGlobaliOrdinati = useMemo(
      () => Object.keys(allStudentByCfSorted),
      [allStudentByCfSorted]
    );

    // cf ordinati della sola lezione utili in view e in edit 🔴
    const cfsLezioneOrdinati = useMemo(() => {
      if (!lezione) return [];
      const cfLezione = new Set(lezione.studenti.map((s) => s.cf)); // 🟠
      return cfsGlobaliOrdinati.filter((cf) => cfLezione.has(cf));
    }, [lezione, cfsGlobaliOrdinati]);

    // util per “Cognome Nome”
    const displayName = (cf: string): string => {
      const s = allStudentByCfSorted[cf];
      if (!s) {
        console.error(
          "LessonRow>displayName > c'è uno stud nella lez che non c'è negli stud"
        );
        return "guarda console";
      }
      const cognome = (s.cognome ?? "").trim();
      const nome = (s.nome ?? "").trim();
      const completo = `${cognome} ${nome}`.trim();
      return completo || cf;
    };

    // Inizializza/aggiorna SOLO i dati del form al cambio di mode/lezione,
    // ma NON toccare "open" (così resta nello stato in cui l'utente l'ha lasciato)
    useEffect(() => {
      if (isEdit && lezione) {
        //siamo arrivati in edit non con path ma navigando l app, DA VIEW
        setDataLezione(lezione.dataLezione);
        const datiIniziali: Record<string, { present: boolean; ore: number }> =
          {};

        const presenti = new Map(lezione.studenti.map((s) => [s.cf, s.ore]));

        for (const cf of cfsGlobaliOrdinati) {
          const h = presenti.get(cf);
          datiIniziali[cf] = h
            ? { present: true, ore: h }
            : { present: false, ore: 1 }; // mettere 1 non top ma paura che sbabbi poi rivedere come gestire
        }

        setPresenze(datiIniziali); // quindi rerendera due volte, non top .. ma chissene adesso
        setErrors({});
        return;
      }

      if (isNew) {
        setDataLezione("");
        const datiIniziali: Record<string, { present: boolean; ore: number }> =
          {};

        for (const cf of cfsGlobaliOrdinati) {
          datiIniziali[cf] = { present: false, ore: 1 };
        }
        setPresenze(datiIniziali);
        setErrors({});
        return;
      }

      if (isView && lezione) {
        // Per view non servono stati form, ma manteniamo data per coerenza visiva se volessi mostrarla in un TextField disabilitato
        setDataLezione(lezione.dataLezione);
        const datiIniziali: Record<string, { present: boolean; ore: number }> =
          {};
        lezione.studenti.forEach((s) => {
          datiIniziali[s.cf] = { present: true, ore: s.ore };
        });
        setPresenze(datiIniziali);
        setErrors({});
      }
    }, [mode, isEdit, isNew, isView, lezione, cfsGlobaliOrdinati]);

    // quando presenze cambia lui rifa questo calcolo e lo assegna di nuovo a presentiSelezionati. useMemo in realtà molto potenti. memoizzazione figli dev essere figo
    const presentiSelezionati = useMemo(
      () => Object.entries(presenze).filter(([, value]) => value.present),
      [presenze]
    );

    const handleOreChange = (cf: string, input: string) => {
      const n = Number.parseInt(input, 10);

      if (!Number.isInteger(n) || n < 1 || n > 5) {
        setErrors((e) => ({ ...e, [`ore:${cf}`]: "Ore tra 1 e 5 (intero)" }));
        //se bad input niente update, resta val prec
        return;
      }

      // togliamo errore
      setErrors((e) => {
        // underscore qui sotto è un alias usato quando non userai la cosa
        const { [`ore:${cf}`]: _, ...rest } = e; // in rest ci va tutto ciò che c'è in e tranne quello che va nella chiave che stai estraendo , che in questo caso è una chiave che non ha un nome definito ma è [k:string] e puoi definire come vuoi basta che sia stringa, e poi puoi anche usarla in questi modi
        return rest; // a noi interessava rest perchè volevamo pulire l imput corrente dall errore suo appunto, perchè siamo nella parte andata bene dell if
      });

      setPresenze((p) => ({
        ...p,
        [cf]: { present: true, ore: n }, //qua come facciamo sempre per array con prev ad es. ,  ma con oggetti, dove quindi aggiungi se non c'è chiave sennò sovrascrivi
      }));
    };

    const handleRemoveStudent = (cf: string) => {
      if (!lezione) return;

      const ancoraPresenti = (lezione.studenti ?? []).filter(
        (s) => s.cf !== cf
      );
      if (ancoraPresenti.length === 0) {
        if (onDeleteLesson) {
          // non dovrebbe servire perchè bottone delete student sparisce se siamo in new
          const ok = window.confirm(
            "È l’ultimo studente presente. Vuoi eliminare l’intera lezione?"
          );
          if (ok) onDeleteLesson(lezione.id);
        } else {
          window.alert("Non puoi rimuovere tutti gli studenti");
        }
        return;
      }

      const payload: {
        id?: number;
        dataLezione: string;
        studenti: PresenzaStudente[];
      } = {
        id: lezione.id,
        dataLezione,
        studenti: ancoraPresenti, // resto invariato
      };

      onSave(payload);
    };

    const validate = (): boolean => {
      const e: typeof errors = {};
      if (!dataLezione.trim()) e.dataLezione = "La data è obbligatoria";
      // opzionale: no data future (lasciato disabilitato)
      // if (isFuture(dataLezione)) e.dataLezione = "La data non può essere nel futuro";

      if (presentiSelezionati.length === 0)
        e.studenti = "Seleziona almeno uno studente presente";

      for (const [cf, v] of Object.entries(presenze)) {
        if (!v.present) continue;
        if (!Number.isInteger(v.ore) || v.ore < 1 || v.ore > 5) {
          e[`ore:${cf}`] = "Ore tra 1 e 5 (intero)";
        }
      }

      setErrors(e);
      return Object.keys(e).length === 0;
    };

    const buildPayload = () => {
      const studenti: PresenzaStudente[] = presentiSelezionati.map(
        ([cf, v]) => ({
          cf,
          ore: v.ore,
        })
      );
      return {
        id: isEdit ? lezione?.id : undefined,
        dataLezione,
        studenti,
      };
    };

    const handleSave = () => {
      if (!validate()) return;
      onSave(buildPayload());
    };

    // TOP COMP, MA MIGLIORAREE RETURN
    return (
      <>
        {/* Riga principale */}
        <TableRow ref={ref}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

          {/* ID */}
          <TableCell component="th" scope="row">
            {isNew ? <em>Nuova</em> : lezione?.id}
          </TableCell>

          {/* Data */}
          <TableCell align="right" sx={{ minWidth: 200 }}>
            {isView ? (
              lezione?.dataLezione
            ) : (
              <TextField
                label="Data (gg/mm/aaaa)"
                value={dataLezione}
                onChange={(e) => setDataLezione(e.target.value)}
                size="small"
                error={!!errors.dataLezione}
                helperText={errors.dataLezione ?? " "}
                placeholder="01/04/1978"
              />
            )}
          </TableCell>

          {/* Azioni */}
          <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
            {isView && lezione && (
              <>
                {onDeleteLesson && (
                  <Tooltip title="Elimina lezione">
                    <IconButton
                      color="error"
                      onClick={() => {
                        const ok = window.confirm("Eliminare questa lezione?");
                        if (ok) onDeleteLesson(lezione.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Modifica">
                  <IconButton color="primary" onClick={() => onEdit(lezione)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {(isEdit || isNew) && (
              <>
                <Tooltip title="Annulla">
                  <IconButton onClick={onCancelEdit}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Salva">
                  <IconButton color="primary" onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </TableCell>
        </TableRow>

        {/* Dettagli studenti (collapse) */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ m: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Studenti
                </Typography>

                {errors.studenti && (
                  <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                    {errors.studenti}
                  </Typography>
                )}

                <Table size="small" aria-label="students">
                  <TableHead>
                    <TableRow>
                      <TableCell>Presente</TableCell>
                      <TableCell>Studente</TableCell>
                      <TableCell>CF</TableCell>
                      <TableCell>Ore</TableCell>
                      {isView && <TableCell align="right">Azioni</TableCell>}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* VIEW: solo gli studenti della lezione, nell’ordine globale */}
                    {isView &&
                      cfsLezioneOrdinati.map((cf) => {
                        const stud = lezione!.studenti.find(
                          (s) => s.cf === cf
                        )!;
                        return (
                          <TableRow key={cf}>
                            <TableCell>
                              <Checkbox checked readOnly />
                            </TableCell>
                            <TableCell>{displayName(cf)}</TableCell>
                            <TableCell>{cf}</TableCell>
                            <TableCell>{stud.ore}</TableCell>
                            <TableCell align="right">
                              {/* Quick remove: costruisce il payload senza quel CF */}
                              <Tooltip title="Rimuovi studente dalla lezione">
                                <span>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleRemoveStudent(cf)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    {/* EDIT: tutti gli studenti in ordine globale, editabili */}
                    {isEdit &&
                      cfsGlobaliOrdinati.map((cf) => {
                        const present = presenze[cf]?.present ?? false;
                        const ore = presenze[cf]?.ore ?? 1;
                        return (
                          <TableRow key={cf}>
                            <TableCell>
                              <Checkbox
                                checked={present}
                                onChange={(e) =>
                                  setPresenze((p) => ({
                                    ...p,
                                    [cf]: {
                                      present: e.target.checked,
                                      ore: Math.max(1, Math.min(5, ore)),
                                    },
                                  }))
                                }
                              />
                            </TableCell>
                            <TableCell>{displayName(cf)}</TableCell>
                            <TableCell>{cf}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                inputProps={{ min: 1, max: 5, step: 1 }}
                                size="small"
                                value={ore}
                                disabled={!present}
                                onChange={(e) =>
                                  handleOreChange(cf, e.target.value)
                                }
                                error={!!errors[`ore:${cf}`]}
                                helperText={
                                  (errors[`ore:${cf}`] as string) ?? " "
                                }
                                sx={{ maxWidth: 100 }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    {/* NEW: tutti gli studenti in ordine globale, editabili */}
                    {isNew &&
                      cfsGlobaliOrdinati.map((cf) => {
                        const present = presenze[cf]?.present ?? false;
                        const ore = presenze[cf]?.ore ?? 1;
                        return (
                          <TableRow key={cf}>
                            <TableCell>
                              <Checkbox
                                checked={present}
                                onChange={(e) =>
                                  setPresenze((p) => ({
                                    ...p,
                                    [cf]: {
                                      present: e.target.checked,
                                      ore: Math.max(1, Math.min(5, ore)),
                                    },
                                  }))
                                }
                              />
                            </TableCell>
                            <TableCell>{displayName(cf)}</TableCell>
                            <TableCell>{cf}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                inputProps={{ min: 1, max: 5, step: 1 }}
                                size="small"
                                value={ore}
                                disabled={!present}
                                onChange={(e) =>
                                  handleOreChange(cf, e.target.value)
                                }
                                error={!!errors[`ore:${cf}`]}
                                helperText={
                                  (errors[`ore:${cf}`] as string) ?? " "
                                }
                                sx={{ maxWidth: 100 }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
);

export default LessonRow;
